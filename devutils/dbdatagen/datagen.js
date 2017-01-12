#!/usr/bin/env node

var tracer = require('tracer'); //For logging
var admin = require("firebase-admin");
var Q = require('q')
var program = require('commander'); //For taking arguments
var colors = require("colors/safe"); //Makes user input pretty
var jsonfile = require('jsonfile')


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
    return typeof args[i] !== "undefined" ? args[i++] : '';
  });
};

function genRandomString() {
  return Math.random().toString(36).substring(7);
}

//Helper function for handling errors
function onError(err) {
  logger.error('Message: %s', err.message)
  logger.debug('Stack: %j', err);
  closeFirebase();
  return 1;
}

//Returns the UID mapped to the ref if exists, else returns the ref
//If the ref is null, returns a random string
function getUIDFromRef(type, ref) {
  if(!ref) return genRandomString();
  if(type === "people") return((peopleRefToUIDs[ref]) ? peopleRefToUIDs[ref] : ref);
}


/*******************************************************************************
 * Data Defaults
 *******************************************************************************/
var defaultData = jsonfile.readFileSync("data/defaults.json");

// Returns a random name
function getRandomName() {
  var count = defaultData.names.length;
  var index = Math.floor(Math.random() * count);
  var name = defaultData.names[index];
  var splitname = name.split(" ");
  var result = {
    full: name,
    first: splitname[0],
    last: splitname[1],
    display: name.replace(" ", "_")
  }
  return result;
}




/*******************************************************************************
 * Firebase
 *******************************************************************************/
var app = admin.initializeApp({
  credential: admin.credential.cert("./cpceed-firebase-admin-key.json"),
  databaseURL: "https://cpceed.firebaseio.com"
});

var db = admin.database();

function closeFirebase() {
  app.delete()
    .then(function() {
      logger.log("Firebase closed successfully");
    })
    .catch(function(error) {
      logger.error("Error closing firebase app:", error);
    });
}



/*******************************************************************************
 * Generating Data
 *******************************************************************************/
var peopleRefToUIDs = {}; //Used to map a persons REF to their user UID
var eventsRefToUIDs = {}; // ^^^ with events
var genOutput = {
  people: [],
  events: []
}

function generateData(templateFile) {
  var template = jsonfile.readFileSync(templateFile);
  var personList = [];
  var eventList = [];
  template.people.forEach(function(person) {
    personList.push(createPerson(person));
  });

  template.events.forEach(function(event) {
    eventList.push(createEvent(event))
  });

  createUsers(personList).then(function() {
    createEvents(eventList).then(function() {
      jsonfile.writeFile("gen-uids.json", genOutput)
      closeFirebase();
    })
  });
}


/*******************************************************************************
 * Creating People
 *******************************************************************************/
//Type = student or admin
function createPerson(template) {
  randomString = genRandomString();
  randomName = getRandomName();
  person = {}
  person.password = ((template.password) ? template.password : randomString);
  person.user = {} //This is the object that will be placed in "/users/{uid}"
  person.user.role = template.role; //This is required!
  person.user.email = ((template.email) ? template.email : "{}.{}@{}.com".format(randomName.first, randomName.last, randomString));
  person.user.firstName = ((template.firstName) ? template.firstName : randomName.first);
  person.user.lastName = ((template.lastName) ? template.lastName : randomName.last);
  person.displayName = ((template.displayName) ? template.displayName : randomName.display)
  person.ref = template.ref;

  person.user = ((person.user.role === "student") ? generateStudentData(person.user, template) : person.user)
  return person;
}

// Used to generate data specfic to the student role
function generateStudentData(user, template) {
  logger.log("Generating student data for", user.email)
  user.approvalStatus = ((template.approvalStatus) ? true : false);
  user.studentId = ((template.studentId) ? template.studentId : genRandomString());
  user.points = ((template.points) ? template.points : 10);
  return user;
}

// Calls #createUser on every person in the list and gathers all promises.
// Returns a "promise of promises".
function createUsers(personList) {
  var the_promises = [];
  personList.forEach(function(person) {
    var deferred = Q.defer();
    createUser(person, function(error, person) {
      if(error) {
        logger.error("Error creating user", person)
      } else {
        logger.log("Done creating user", person.uid);
        //uidWriteStream.write("{}\n".format(person.uid))
        genOutput.people.push(person.uid)
      }
      deferred.resolve(person)
    })
    the_promises.push(deferred.promise);
  });
  return Q.all(the_promises);
}

// Handles the firebase-admin calls to to creating the user and adding user data
function createUser(person, cb) {
  admin.auth().createUser({
      email: person.user.email,
      emailVerified: true,
      password: person.password,
      displayName: person.displayName,
      disabled: false
    })
    .then(function(userRecord) { // A UserRecord representation of the newly created user is returned
      logger.log("Successfully created new user:", userRecord.uid);
      person.uid = userRecord.uid;
      if(person.ref) {
        peopleRefToUIDs[person.ref] = person.uid;
      }
      var usersRef = db.ref("users/")
      var userRef = usersRef.child(person.uid)
      userRef.update(person.user, function(error) {
        cb(error, person)
      })
    })
    .catch(function(error) {
      cb(error, person)
    });
}


/*******************************************************************************
 * Creating Events
 *******************************************************************************/
//Creates and returns a fully-filled event object using the psased in template
//and filling in any missing data with generated data.
function createEvent(template) {
  randomString = genRandomString();
  event = {};
  event.creator = getUIDFromRef(template.ref);
  event.contact = ((template.contact) ? template.contact : event.creator);
  event.category = template.category;
  event.datetime = template.datetime;
  event.location = template.location;
  event.title = template.title;
  event.description = template.description;

  return event;
}

//Calls #saveEvent on every event in the list and gathers all the promises.
// Returns a "promise of promises".
function createEvents(eventList) {
  var the_promises = [];
  eventList.forEach(function(event) {
    var deferred = Q.defer();
    saveEvent(event, function(result) {
      if(result.uid) genOutput.events.push(result.uid);
      deferred.resolve(result);
    })
    the_promises.push(deferred.promise);
  });
  return Q.all(the_promises);
}

// Handles the firebase-admin calls add the event data to '/events'
// Returns the event object with the UID key filled if successfull.
function saveEvent(event, cb) {
  var eventsRef = db.ref("events/");
  var newEventRef = eventsRef.push();
  newEventRef.set({
    creator: event.creator,
    contact: event.contact,
    category: event.category,
    datetime: event.datetime,
    location: event.location,
    title: event.title,
    description: event.description
  }, function(error) {
    event.uid = newEventRef.key;
    logger.log("Done creating event ", event.title, " with UID ", event.uid)

    cb(event)
  })
}


/*******************************************************************************
 * Deleting Data
 *******************************************************************************/
// Iterates through the passed in file to get the UIDs of people that need to be
// deleted.
function deleteData(uidFile) {
  var delete_promises = [];
  var deferred = Q.defer();
  logger.info("Deleting objects");
  jsonfile.readFile(uidFile, function(err, uids) {
    uids.people.forEach(function(userUID) {
      deleteUser(userUID, function(userUID) {
        deferred.resolve(userUID)
      })
      delete_promises.push(deferred.promise);
    });
    uids.events.forEach(function(eventUID) {
      deleteEvent(eventUID, function(eventUID) {
        deferred.resolve(eventUID)
      })
    })

    Q.all(delete_promises).then(function() {
      closeFirebase();
    })
  });

}

// Handles connecting to Firebase and deleting all relevant user data
function deleteUser(uid, cb) {
  logger.log("Deleting user with UID:", uid)
  admin.auth().deleteUser(uid)
    .then(function() { //The user account was deleted
      logger.log("Successfully deleted user", uid);
    })
    .catch(function(error) {
      //Error with deleting user account. Most likely case it that it
      //doesn't exist anymore.
      logger.warn("Error deleting user:", error);
      cb(null);
    }).then(function() {
      logger.log("Removing user data")
      var usersRef = db.ref("users/")
      usersRef.update({
        [uid]: null
      }, function(error) {
        //Even if there was an error deleting an account due to it may have been
        //removed by something else, there still may be user data to remove.
        if(error) logger.warn("Error removing user data for UID:", uid, error);
        else logger.log("Removing used with uid:", uid);
        cb(uid);
      })
    });
}

// Handles connecting to Firebase and deleting the event data
function deleteEvent(uid, cb) {
  logger.log("Deleting event with UID:", uid)
  var eventsRef = db.ref("events/")
  eventsRef.update({
    [uid]: null
  }, function(error) {
    if(error) logger.warn("Error removing event data for UID:", uid, error);
    else logger.log("Removed event data");
    cb(uid);
  })

}


/*******************************************************************************
 * Activity & Event Points
 *******************************************************************************/
//Used to reset the Activity & Event points to their default values
function resetAEPoints() {
  logger.log("Resetting A&E Points")
  var points = jsonfile.readFileSync("data/aepoints.json");
  var pointsRef = db.ref("aepoints/")
  pointsRef.set(points, function(error) {
    logger.log("Done resetting A&E Points");
    closeFirebase();
  })
}


/*******************************************************************************
 * Program
 *******************************************************************************/
//Handles CLI arguemnts/options
program
  .version('0.0.1')
  .option('-g, --gen <genfile>', 'Generate data using passed in file as template')
  .option('-d, --delete <uidfile>', 'Delete all UIDs listed in file')
  .option('-p --points', 'Resets the activity & event points')
  .parse(process.argv);



if(program.gen) {
  generateData(program.gen);
} else if(program.delete) {
  deleteData(program.delete);
} else if(program.points) {
  resetAEPoints();
}
