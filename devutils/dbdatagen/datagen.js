#!/usr/bin/env node

var prompt = require('prompt') //Gets user input

//Helper function for handling errors
function onError(err) {
    console.log(err);
    return 1;
}


//Get user input
prompt.message = ("DB Data Generator");
prompt.delimiter = colors.green(":");
prompt.start(); //Doesn't need to be called again
prompt.get({
  properties: {

  }
}, function(err, result){
  if(err) return onError(err);

})
