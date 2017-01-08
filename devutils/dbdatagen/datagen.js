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

//Ever used Pythons String .format() method? This does the same thing
String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};


function genRandomString(){
  return Math.random().toString(36).substring(7);
}


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
  admin.auth().createUser({
    email: "user{}@example.com".format(genRandomString()),
    emailVerified: true,
    password: "secretPassword",
    displayName: "Dummy User",
    disabled: false
  })
    .then(function(userRecord) {
      // A UserRecord representation of the newly created user is returned
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
}

genUsers(1);
