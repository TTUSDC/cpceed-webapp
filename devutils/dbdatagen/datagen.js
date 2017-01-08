#!/usr/bin/env node

var prompt = require('prompt') //Gets user input
var tracer = require('tracer'); //For logging
var admin = require("firebase-admin");

//Logging stuff
tracer.setLevel(4) //'log':0, 'trace':1, 'debug':2, 'info':3, 'warn':4, 'error':5
var logger = tracer.console({
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});


admin.initializeApp({
  credential: admin.credential.cert("./cpceed-firebase-admin-key.json"),
  databaseURL: "https://cpceed.firebaseio.com"
});

//Helper function for handling errors
function onError(err) {
  logger.error('Message: %s', err.message)
  logger.debug('Stack: %j', err);
  return 1;
}

//Generates count users
function genUsers(count) {

}
