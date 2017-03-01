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
- [`login(email, password)`](#login)
- [`getLoggedInUser()`](#get-logged-in-user)
- [`logout()`](#logout)
- [`createReport(newReport)`](#create-report)
- [`modifyReport(uid, updatedReport)`](#modify-report)
- [`getReportByUid(uid)`](#get-report-by-uid)
- [`getAllReports()`](#get-all-reports)
- [`deleteReport(uid)`](#delete-report)


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
    "studentId" : NUMBER
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
```javascript
server.deleteReport(testEventReportUid).then(function() {
  console.log("Report deleted!")
}).catch(function(reason) {
  console.log("Report not deleted with reason", reason)
})

```
