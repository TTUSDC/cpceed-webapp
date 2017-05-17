# Server API

This component is comprised of several modules to server as an internal library for connecting to the [backend API](https://github.com/TTUSDC/CPCEEDWebAppBackend).

Currently, this README will only show method signatures as a reference for what is provided here. As this is still a work in progress, see the server tests for usage examples.
# Contents

## Objects
- [User](#user)
- [Reports](#report)

## Methods  
### Server
- [`init()`](#init)

### User Auth
- [`login(email, password)`](#login)
- [`logout()`](#logout)

### Events
- [`createEvent(newEvent)`](#create-event)
- [`modifyEvent(uid, updatedEvent)`](#modify-event)
- [`getEventByUid(uid)`](#get-event-by-uid)
- [`getAllEvents()`](#get-all-events)
- [`removeEvent(uid)`](#delete-event)


# Objects

## User

```javascript
{
  "user" : {
    "approvalStatus" : BOOLEAN,
    "email" : STRING,
    "firstName" : STRING,
    "lastName" : STRING,
    "points" : {
      "career" : NUMBER,
      "community" : NUMBER,
      "firstother" : NUMBER,
      "firstworkshops" : NUMBER,
      "mentor" : NUMBER,
      "other" : NUMBER,
      "outreach" : NUMBER,
      "professor" : NUMBER,
      "staff" :NUMBER,
      "misc": NUMBER,
    },
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

# Modules

## Server

Holds initialization functions.

### Init

Method: `init()`

Returns: None

#### Example

```javascript
import init from 'server/server';
init();
```

## User Authentication

### Login

Method: `login(email, password)`

Returns: Promise

- Resolve: user object on success

#### Example

```javascript
import { login } from 'server/user-auth';
var email = "test.person@email.com"
var password = "secureP@$$word"
login(email, password).then(function(user){
  console.log("Logged in successfully!")
}).catch(function(reason){
  console.log("Could not login with reason", reason)
})
```

### Logout

Method: `logout()`

Returns: None

#### Example

```javascript
import { logout } from 'server/user-auth';
logout();
```

## Events
### Create Event
Method: `createEvent(newEvent)`

Returns: Promise
- Resolve: UID of created event

#### Example
```javascript
import { create as createEvent } from 'server/events';
const newEvent = {
  "datetime": "2017:05:20:09:00",
  "location": "United Supermarkets Arena",
  "title": "Graduation",
  "description": "TTU Commencement for the College of Engineering"
}

createEvent(newEvent).then(function(uid){
  console.log("Event created with uid",uid)
}).catch(function(reason){
  console.log("Event NOT created with reason", reason)
})
```


### Modify Event
Method: `modifyEvent(uid, updatedEvent)`

Returns: Promise

#### Example
```javascript
import { modify as modifyEvent } from 'server/events';
const newEvent = {...}//As above
const newEventUid = //Let's pretend this is the UID returned in previous method.
testEvent.title = "Commencement";
modifyEvent(newEventUid, testEvent).then(function(){
  console.log("Event modified!")
}).catch(function(reason){
  console.log("Event NOT modified with reason", reason)
})
```


### Get Event By UID
Method: `getEventByUid(uid)`

Returns: Promise
- Resolve: Event object

#### Example
```javascript
import { getByUid as getEventByUid } from 'server/events';
const newEventUid = //Let's pretend this is the UID returned in previous method.

getEventByUid(newEventUid).then(function(event){
  console.log("Got event", event)
}).catch(function(reason){
  console.log("Did not get event with reason", reason)
})
```

### Get All Events
Method: `getAllEvents()`

Returns: Promise
- Resolve: Object containing all event objects

#### Example
```javascript
import { getAll as getAllEvents } from 'server/events';
getAllEvents().then(function(events){
  console.log("Got events", events)
}).catch(function(reason){
  console.log("Did not get events with reason", reason)
})
```

### Delete Event
Method: `removeEvent(uid)`

Returns: Promise

#### Example
```javascript
import { remove as removeEvent } from 'server/events';
const newEventUid = //Let's pretend this is the UID returned in previous method.
removeEvent(newEventUid).then(function(){
  console.log("Event deleted")
}).catch(function(reason){
  console.log("Event NOT deleted with reason", reason)
})
```
