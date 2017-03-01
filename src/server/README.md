# Server API
This component is to serve as an internal library for connecting to the [backend
API](https://github.com/TTUSDC/CPCEEDWebAppBackend).

## Usage
`require('PATH/TO/server.js')`

# Contents
## Objects
- [User](#user)
- [Reports](#report)



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

Returns:
Promise, resolves with user object on success, rejects on failure.

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
