# Server API
This component is to serve as an internal library for connecting to the [backend
API](https://github.com/TTUSDC/CPCEEDWebAppBackend).

## Usage
`require('PATH/TO/server.js')`

# Objects
## User example
```javascript
"UID": {
  approvalStatus: true,
  email: "email@email.com",
  firstName: "firstname",
  lastName: "lastName",
  points: 0,
  role: "STUDENT",
  studentId: "ID"
},
```

# Methods

## login()
Parameters:
- email
- password

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

## getLoggedInUser()
Parameters: None

Returns: User object if logged in

#### Example
```javascript
var user = server.getLoggedInUser();
if(user) console.log(user.firstName," is logged in!")
else console.log("User not logged in!")
```

## logout()
Parameters: None

Returns: None

#### Example
```javascript
user.logout()
if(user.getLoggedInUser()) console.log("This won't happen")
else console.log("User logged out successfully.")
```
