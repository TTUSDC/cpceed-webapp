#!/usr/bin/env node

var prompt = require('prompt') //Gets user input
var tracer = require('tracer'); //For logging
var admin = require("firebase-admin");
var fs = require('fs'); //FileSystem
var Q = require('q')
var program = require('commander'); //For taking arguments
var colors = require("colors/safe"); //Makes user input pretty


/*******************************************************************************
* GLOBAL VARIABLES
*******************************************************************************/
var uidWriteStream;


/*******************************************************************************
* UTILS
*******************************************************************************/

//Logging stuff
tracer.setLevel(0) //'log':0, 'trace':1, 'debug':2, 'info':3, 'warn':4, 'error':5
var logger = tracer.console({
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});

//Ever used Pythons String .format() method? This does the same thing
String.prototype.format = function() {
  var i = 0,
    args = arguments;
  return this.replace(/{}/g, function() {
    return typeof args[i] != "undefined" ? args[i++] : '';
  });
};

function genRandomString() {
  return Math.random().toString(36).substring(7);
}

//Helper function for handling errors
function onError(err) {
  logger.error('Message: %s', err.message)
  logger.debug('Stack: %j', err);
  return 1;
}

/*******************************************************************************
* Firebase Initialization
*******************************************************************************/
var app = admin.initializeApp({
  credential: admin.credential.cert("./cpceed-firebase-admin-key.json"),
  databaseURL: "https://cpceed.firebaseio.com"
});
var db = admin.database();



//Type = student or admin
function createProps(role) {
  randomString = genRandomString();
  props = {}
  props.password = randomString;
  props.user = {} //This is the object that will be placed in "/users/{uid}"
  props.user.role = role;
  props.user.email = "user{}@example.com".format(randomString)
  props.user.firstName = "First"
  props.user.lastName = "Last"
  props.displayName = "dummyDisplay"

  props.user = ((props.user.role == "student") ? generateStudentData(props.user) : props.user)
  return props;
}

function generateStudentData(user) {
  logger.log("Generating student data for", user.displayName)
  user.approvalStatus = true;
  user.studentId = genRandomString();
  user.points = 10
  return user;
}


function createUsers(propsList) {
  var the_promises = [];
  propsList.forEach(function(props) {
    var deferred = Q.defer();
    createUser(props, function(error, props) {
      logger.log("Done creating user", props.uid);
      uidWriteStream.write("{}\n".format(props.uid))
      deferred.resolve(props)
    })
    the_promises.push(deferred.promise);
  });
  return Q.all(the_promises);
}


function createUser(props, cb) {
  admin.auth().createUser({
      email: props.user.email,
      emailVerified: true,
      password: props.password,
      displayName: props.displayName,
      disabled: false
    })
    .then(function(userRecord) {
      // A UserRecord representation of the newly created user is returned
      logger.log("Successfully created new user:", userRecord.uid);
      props.uid = userRecord.uid;
      var usersRef = db.ref("users/")
      var userRef = usersRef.child(props.uid)
      userRef.update(props.user, function(error) {
        cb(error, props)
      })

    })
    .catch(function(error) {
      cb(error, props)
    });
}

function deleteUser(uid, cb) {
  admin.auth().deleteUser(uid)
    .then(function() {
      logger.log("Successfully deleted user", uid);
      logger.log("Removing user data")
      var usersRef = db.ref("users/")
      usersRef.update({
        [uid]: null
      }, function(error) {
        if(error) {
          logger.warn("Error removing user data for UID:", uid, error)
        }
        logger.log("Removed user data")
        cb(null, uid);
      })
    })
    .catch(function(error) {
      logger.error("Error deleting user:", error);
      cb(error, uid);
    });
}


function generateData(){
  prompt.get({
    properties: {
      studentCount: {
        description: colors.magenta("Number of students to generate"),
        required: true,
        pattern: /^[0-9]+$/, //The message below should give a hint as to what this pattern is
        message: 'Should be a number.'
      },
      adminCount: {
        description: colors.magenta("Number of admins to generate"),
        required: true,
        pattern: /^[0-9]+$/, //The message below should give a hint as to what this pattern is
        message: 'Should be a number.'
      }
    }
  }, function(err, result){
    if(err) return onError(err);

      uidWriteStream = fs.createWriteStream('./genUIDS', {'flags': 'a'});
      var propsList = []
      for(var i = 0; i < result.studentCount; i++){
        propsList.push(createProps("student"))
      }

      for(var i = 0; i < result.adminCount; i++){
        propsList.push(createProps("admin"))

      }
      createUsers(propsList).then(function(){
        uidWriteStream.end();
        app.delete()
        .then(function() {
          console.log("Firebase closed successfully");
        })
        .catch(function(error) {
          console.log("Error closing firebase app:", error);
        });
      })

  })



}

function deleteData(){

  var uidList = []
  var delete_promises = [];
  logger.info("Deleting UIDs");
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./genUIDS')
  });

  lineReader.on('line', function(line) {
    uidList.push(line);
    var deferred = Q.defer();
    deleteUser(line, function(error, line) {
      logger.log("Removing used with uid:", line);
      deferred.resolve(line)
    })
    delete_promises.push(deferred.promise);
  });

  lineReader.on('close', function() {
    Q.all(delete_promises).then(function() {
      fs.unlink('./genUIDS')
      app.delete()
        .then(function() {
          logger.log("Firebase closed successfully");
        })
        .catch(function(error) {
          logger.error("Error closing firebase app:", error);
        });
    })
  })

}
prompt.message = ("CPCEED Web App Database Data Generator")
prompt.delimiter = colors.green(":");
prompt.start();

program
    .version('0.0.1')
    .option('-g, --gen', 'Generate data')
    .option('-d, --delete <uidfile>', 'Delete all UIDs listed in file')
    .parse(process.argv);


if(program.gen){
  generateData();
} else if(program.delete){
  deleteData();
}
