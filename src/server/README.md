# Server API
This component is to serve as an internal library for connecting to the [backend
API](https://github.com/TTUSDC/CPCEEDWebAppBackend).

## Usage
`require('PATH/TO/server.js')`

# Contents
## Objects
- [User](#user)
- [Reports](#report)

## Methods  
### User Auth
- [`login(email, password)`](#login)
- [`getLoggedInUser()`](#get-logged-in-user)
- [`logout()`](#logout)
### Reports
- [`createReport(newReport)`](#create-report)
- [`modifyReport(uid, updatedReport)`](#modify-report)
- [`getReportByUid(uid)`](#get-report-by-uid)
- [`getAllReports()`](#get-all-reports)
- [`deleteReport(uid)`](#delete-report)
### Events
- [`createEvent(newEvent)`](#create-event)
- [`modifyEvent(uid, updatedEvent)`](#modify-event)
- [`getEventByUid(uid)`](#get-event-by-uid)
- [`getAllEvents()`](#get-all-events)
- [`deleteEvent(uid)`](#delete-event)


# Objects
## User
```javascript
{
  "user" : {
    "approvalStatus" : BOOLEAN,
    "email" : STRING,
    "firstName" : STRING,
    "lastName" : STRING,
    "points" : NUMBER,
    "role" : ENUM/STRING,
    "studentId" : STRING
  }
}
```

## Report
### Event
```javascript
{
  "type" : ENUM/STRING,
  "approvalStatus" : ENUM/STRING,
  "student" : USER-UID,
  "event" : EVENT-UID,
}
```

### Other
```javascript
{
  "type" : ENUM/STRING,
  "approvalStatus" : ENUM/STRING,
  "student" : USER-UID,
  "category" : ENUM/STRING,
  "datetime" : DATE-TIME STRING,
  "location" : STRING,
  "title" : STRING,
  "description" : STRING
}
```

# Methods

## Login
Method: `login(email, password)`

Returns: Promise  
- Resolve: user object on success

#### Example
```javascript
var email = "test.person@email.com"
var password = "secureP@$$word"
server.login(email, password).then(function(user){
  console.log("Logged in successfully!")
}).catch(function(reason){
  console.log("Could not login with reason", reason)
})
```

## Get Logged In User
Method: `getLoggedInUser()`

Returns: User object if logged in

#### Example
```javascript
var user = server.getLoggedInUser();
if(user) console.log(user.firstName," is logged in!")
else console.log("User not logged in!")
```

## Logout
Method: `logout()`

Returns: None

#### Example
```javascript
user.logout()
if(user.getLoggedInUser()) console.log("This won't happen")
else console.log("User logged out successfully.")
```

## Create Report
Method: `createReport(newReport)`

Returns: Promise  
- Resolve: UID of new user

#### Example
```javascript
var testEventReport = {
  type: "event",
  student: "1234567",
  event: "9876543321"
}
server.createReport(testEventReport).then(function(uid) {
  console.log(uid, "created!")
}).catch(function(reason) {
  console.log("Event report was NOT created with reason", reason)
})
```

## Modify Report
Method: `modifyReport(uid, updatedReport)`

Returns: Promise
- Resolve: On success
- Reject: Reason

#### Example
```javascript
var testEventReport = {
  type: "event",
  student: "1234567",
  event: "12343645"
}

var reportUid = ... //Let's pretend this is the UID returned from creating report

server.modifyReport(testEventReportUid, testEventReport).then(function() {
  console.log("Report modified!")
}).catch(function(reason) {
  console.log("Report NOT modified with reason", reason);
})
```

## Get Report By UID
Method: `getReportByUid(uid)`

Returns: Promise
- Resolve: Report object with passed in UID

#### Example
```javascript
server.getReportByUid(testEventReportUid).then(function(report){
  console.log("Report retrieved", report);
}).catch(function(reason){
  console.log("Report NOT retrieved with reason", reason);
})
```

## Get All Reports
Method: `getAllReports()`

Returns: Promise
- Resolve: All the report objects

#### Example
```javascript
server.getAllReports().then(function(reports){
  console.log("Reports retrieved", report);
}).catch(function(reason) {
  console.log("Report NOT retrieved with reason", reason);
})
```

## Delete Report
Method: `deleteReport(uid)`

Returns: Promise

#### Example
```javascript
server.deleteReport(testEventReportUid).then(function() {
  console.log("Report deleted!")
}).catch(function(reason) {
  console.log("Report not deleted with reason", reason)
})
```

## Create Event
Method: `createEvent(newEvent)`

Returns: Promise
- Resolve: UID of created event

#### Example
```javascript
var newEvent = {
  "datetime": "2017:05:20:09:00",
  "location": "United Supermarkets Arena",
  "title": "Graduation",
  "description": "TTU Commencement for the College of Engineering"
}

server.createEvent(newEvent).then(function(uid){
  console.log("Event created with uid",uid)
}).catch(function(reason){
  console.log("Event NOT created with reason", reason)
})
```


## Modify Event
Method: `modifyEvent(uid, updatedEvent)`

Returns: Promise

#### Example
```javascript
var newEvent = {...}//As above
var newEventUid = //Let's pretend this is the UID returned in previous method.
testEvent.title = "Commencement";
server.modifyEvent(testEventUid, testEvent).then(function(){
  console.log("Event modified!")
}).catch(function(reason){
  console.log("Event NOT modified with reason", reason)
})
```


## Get Event By UID
Method: `getEventByUid(uid)`

Returns: Promise
- Resolve: Event object

#### Example
```javascript
var newEventUid = //Let's pretend this is the UID returned in previous method.

server.getEventByUid(testEventUid).then(function(event){
  console.log("Got event", event)
}).catch(function(reason){
  console.log("Did not get event with reason", reason)
})
```

## Get All Events
Method: `getAllEvents()`

Returns: Promise
- Resolve: Object containing all event objects

#### Example
```javascript
server.getAllEvents().then(function(events){
  console.log("Got events", events)
}).catch(function(reason){
  console.log("Did not get events with reason", reason)
})
```

## Delete Event
Method: `deleteEvent(uid)`

Returns: Promise

#### Example
```javascript
var newEventUid = //Let's pretend this is the UID returned in previous method.
server.deleteEvent(newEventUid).then(function(){
  console.log("Event deleted")
}).catch(function(reason){
  console.log("Event NOT deleted with reason", reason)
})
```
