should = require 'should'
S3Deployer = require '../libs/s3-deployer'
fs = require 'fs'
Q = require 'q'

pkg = JSON.parse(fs.readFileSync('./package.json'))

# Create a knox mock which expects the objects in expectedArray to be uploaded
# and will call the "response" event callback with the given status code
createClient = (statusCode, expectedArray) ->
  i = 0
  expected = expectedArray[i]
  client =
    bucket: 'test'
    put: (dest, options) ->
      dest.should.equal expected.dest
      options["Content-Length"].should.equal expected.length
      options["Content-Type"].should.equal expected.type
      req =
        setTimeout: (millis, cb) ->
          millis.should.equal 1000*30
          cb.should.be.type('function')
          expected.setTimeoutCalled = true
        on: (ev, cb) ->
          cb.should.be.type('function')
          if ev is 'error'
            expected.onErrorCalled = true
          else if ev is 'response'
            expected.cb = cb
        end: (data) ->
          data.toString('utf-8').should.be.equal expected.data
          expected.endCalled = true
          timeoutFunction = (cb) ->
            # returns a function with cb inside closure
            ->  cb(statusCode: statusCode)
          setTimeout timeoutFunction(expected.cb), 100
          expected = expectedArray[++i]

      return req

  return client

describe 'Deploy S3', ->
  it 'should prepare files array properly', (done) ->
    deployer = new S3Deployer(pkg)
    fileSrcDestArray = deployer.prepareFileArray()
    fileSrcDestArray.length.should.equal 2
    fileSrcDestArray[0].src.should.equal 'test/deploy/bar/foo'
    fileSrcDestArray[0].dest.should.equal 'deploy-s3/bar/foo'
    fileSrcDestArray[1].src.should.equal 'test/deploy/foo'
    fileSrcDestArray[1].dest.should.equal 'deploy-s3/foo'
    done()

  it 'should upload one file succesfuly', (done) ->
    expected =
      dest: 'deploy-s3/bar/foo'
      length: 7
      type: 'application/octet-stream'
      data: 'bar/foo'
    client = createClient(200, [expected])

    deployer = new S3Deployer(pkg, client)
    deployer.upload('test/deploy/bar/foo', 'deploy-s3/bar/foo').then ->
      expected.setTimeoutCalled.should.be.ok
      expected.onErrorCalled.should.be.ok
      expected.endCalled.should.be.ok
      done()

  it 'should throw when failing upload', (done) ->
    thenCalled = false
    expected =
      dest: 'deploy-s3/bar/foo'
      length: 7
      type: 'application/octet-stream'
      data: 'bar/foo'
    client = createClient(401, [expected])

    deployer = new S3Deployer(pkg, client)
    deployer.upload('test/deploy/bar/foo', 'deploy-s3/bar/foo').then ->
      thenCalled = true
    .fail ->
      thenCalled.should.be.not.ok
      expected.setTimeoutCalled.should.be.ok
      expected.onErrorCalled.should.be.ok
      expected.endCalled.should.be.ok
      done()

  it 'should upload files under given directory to s3/package/', (done) ->
    expectedFirst =
      dest: 'deploy-s3/bar/foo'
      length: 7
      type: 'application/octet-stream'
      data: 'bar/foo'
    expectedSecond =
      dest: 'deploy-s3/foo'
      length: 3
      type: 'application/octet-stream'
      data: 'foo'

    client = createClient(200, [expectedFirst, expectedSecond])
    deployer = new S3Deployer(pkg, client)

    doneHandler = ->
      console.log 'Done handler'
      for expected in [expectedFirst, expectedSecond]
        expected.setTimeoutCalled.should.be.ok
        expected.onErrorCalled.should.be.ok
        expected.endCalled.should.be.ok
      done()

    failHandler = (reason) ->
      console.error reason
      done(reason)

    progressHandler = (progressed) ->
      console.log progressed

    deployer.deploy().then doneHandler, failHandler, progressHandler
    console.log('\n')