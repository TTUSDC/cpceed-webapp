# Server API
This component is comprised of several modules to server as an internal library for connecting to the [backend
API](https://github.com/TTUSDC/CPCEEDWebAppBackend).

Currently, this README will only show method signatures as a reference for what is provided here.
As this is still a work in progress, see the server tests for usage examples. 


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

