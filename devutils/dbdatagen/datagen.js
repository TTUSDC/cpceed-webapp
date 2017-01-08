#!/usr/bin/env node

var prompt = require('prompt') //Gets user input
var tracer = require('tracer'); //For loggin

//Logging stuff
tracer.setLevel(4) //'log':0, 'trace':1, 'debug':2, 'info':3, 'warn':4, 'error':5
var logger = tracer.console({
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});



//Helper function for handling errors
function onError(err) {
  logger.error('Message: %s', err.message)
  logger.debug('Stack: %j', err);
  return 1;
}


//Get user input
prompt.message = ("DB Data Generator");
prompt.delimiter = colors.green(":");
prompt.start(); //Doesn't need to be called again
prompt.get({
  properties: {

  }
}, function(err, result) {
  if(err) return onError(err);

})
