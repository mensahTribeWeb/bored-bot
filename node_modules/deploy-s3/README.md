# Deploy S3

[![Build Status](https://travis-ci.org/vtex/deploy-s3.png?branch=master)](https://travis-ci.org/vtex/deploy-s3)

### Usage

Install with npm:

    npm i --save deploy-s3

In your package.json, you must have the following properties defined:

    "name": "oms-ui"
    "deploy": "myDeployDirectory/"
    
In a file or in env variables, you must have the credentials for using S3:
    
    {
        "key": "somestring",
        "secret": "somebigstring"
    } 
    
In your task runner, create a [knox](https://github.com/LearnBoost/knox)-compatible S3 client and deploy:

    S3Deployer = require 'deploy-s3'
    
    # Read your package.json file
    pkg = JSON.parse fs.readFileSync './package.json'
    
    # Read your access key and secret key
    credentials = JSON.parse fs.readFileSync '/credentials.json'
	
	# Choose your bucket
	credentials.bucket = 'vtex-io'
	
	# Create a client with your credentials
	client = knox.createClient credentials
	
	# Create a new S3Deployer 
	deployer = new S3Deployer(pkg, client)
	
	doneHandler = -> console.log 'Done'
	failHandler = console.error
	progressHandler = console.log
	
	# deploy() returns a promise and notifies of each uploaded file
	deployer.deploy().then doneHandler, failHandler, progressHandler
	
This will cause **every file** under `myDeployDirectory/` to be deployed to the `vtex-io` bucket under the `oms-ui` directory.

If your doneHandler is called, that means your deploy is complete.

### Options

S3Deployer accepts a third parameter with options:

    dryrun: if upload should be skipped. Defaults to false.
    chunk: how many files to upload in parallel. Defaults to 20.
    batchTimeout: timeout for entire upload. millis. Defaults to 1000 * 60 * 5.
    fileTimeout: timeout for upload of each file. millis. Defaults to 1000 * 30.
