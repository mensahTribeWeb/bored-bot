fs = require 'fs'
mime = require 'mime'
_ = require 'lodash'
Q = require 'q'
glob = require 'glob'
path = require 'path'

class S3Deployer
  # packageJson: Object of this project's package.json
  # client: knox-compatible client.
  # options:
  #   dryrun: if upload should be skipped. Defaults to false.
  #   chunk: how many files to upload in parallel. Defaults to 20.
  #   batchTimeout: timeout for entire upload. millis. Defaults to 1000 * 60 * 5.
  #   fileTimeout: timeout for upload of each file. millis. Defaults to 1000 * 30.
  constructor: (@packageJson, @client, @options = {}) ->
    @packageName = @packageJson.name
    @deployDirectory = @packageJson.deploy

  # Deploy every file under @deployDirectory to bucket/@packageName/
  deploy: =>
    console.log "Running in dry run" if @options.dryrun
    fileArray = @prepareFileArray()
    @batchUploadFileArray(fileArray, @options.chunk, @options.batchTimeout)

  # Returns an array with one object of the following type for each file in @deployDirectory:
  # { src: 'deploy/myfile', dest: 'package/myfile' }
  prepareFileArray: =>
    files = glob.sync("**", {mark: true, cwd: @deployDirectory}) # find all files and dirs
    files = _.reject files, (f) -> f.charAt(f.length-1) is '/' # remove dirs
    _.map files, (f) => {src: path.join(@deployDirectory, f), dest: @packageName + '/' + f}

  # Uploads file at src to dest using @client. Expects a knox-like client.
  upload: (src, dest) =>
    throw new Error("Paremeter src is required") unless src
    throw new Error("Paremeter dest is required") unless dest
    console.log "Uploading file #{src} to #{dest}" if @options.verbose
    return Q() if @options.dryrun

    deferred = Q.defer()
    data = fs.readFileSync(src)
    req = @client.put dest,
      "Content-Length": data.length
      "Content-Type": mime.lookup(dest)

    # Let's not wait for more than timeout seconds to fail the build if there is no response to the upload request
    timeoutMillis = @options.fileTimeout or 1000 * 30
    timeoutCallback = ->
      req.abort()
      deferred.reject new Error("Timeout exceeded when uploading #{dest}")

    req.setTimeout timeoutMillis, timeoutCallback

    req.on "error", (err) ->
      deferred.reject new Error(err)

    req.on "response", (res) ->
      data = ""
      res.on 'data', (chunk) -> data += chunk
      res.on 'end', (chunk) ->
        data += chunk if chunk
        if 200 is res.statusCode
          deferred.resolve(data)
        else
          deferred.reject new Error("Failed to upload #{dest}, status: #{res.statusCode}, \n #{data}")

    req.end data
    return deferred.promise

  # Uploads every file in fileArray in parallel, chunk by chunk.
  batchUploadFileArray: (fileArray, chunk = 20, timeout = 1000 * 60 * 5) =>
    console.log 'Starting deploy, chunk:', chunk, 'timeout:', timeout if @options.verbose
    deferred = Q.defer() # We make our own deferred in order to be able to notify progress
    upload = Q() # Create initial promise for upload
    # Create multiple batches, each with at most `chunk` number of files
    batches = []
    batches.push fileArray.slice(index, index + chunk) for index in [0..fileArray.length] by chunk
    batches.forEach (fileArrayBatch, batchIndex) =>
      console.log 'Batch', batchIndex if @options.verbose
      # Start uploading the next batch when this one is finished
      upload = upload.then =>
          # Creates a promise for the upload of each file in this batch and notifies upon progress
          # Return a promise that only resolves when all files in this batch are uploaded
          Q.all _.map fileArrayBatch, (file, i) =>
            @upload(file.src, file.dest).then =>
              deferred.notify "[" +
                String('000'+ ((batchIndex*chunk) + i + 1)).slice(-3) + "/" +
                String('000'+ ((batchIndex*chunk) + fileArrayBatch.length)).slice(-3) + "]" +
                " https://#{@client.bucket}.s3.amazonaws.com/#{file.dest}"

    # Set a timeout for failure
    timeoutKey = setTimeout (-> throw new Error("Timeout exceeded when uploading files")), timeout
    # At the end of the last batch, clear the timeout and resolve the deferred
    upload.then ->
      clearTimeout(timeoutKey)
      deferred.resolve()

    upload.fail (reason) ->
      deferred.reject(reason)

    return deferred.promise

module.exports = S3Deployer
