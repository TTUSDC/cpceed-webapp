# Server API

This component is comprised of several modules to server as an internal library for connecting to the [backend API](/api).

Currently, this README will only show method signatures as a reference for what is provided here. As this is still a work in progress, see the server tests for usage examples.
# Contents

## Objects
- [User](#user)

## Methods  
### User Auth
- [`login(email, password)`](#login)
- [`logout()`](#logout)


# Objects

## User
The user can be broken into two sub-objects: Student and Admin.

These are the two schemas:

### Student
```javascript
{
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Admin'],
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
  points: pointOption,
  community: pointOption,
  firstother: pointOption,
  firstworkshops: pointOption,
  mentor: pointOption,
  other: pointOption,
  outreach: pointOption,
  professor: pointOption,
  staff: pointOption,
  misc: pointOption,
  studentId: {
    type: String,
  }
}
```
where `pointOption` is:
```javascript
{
  type: Number,
  required: true,
  default: 0,
};
```

### Admin

```javascript
{
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Admin'],
    required: true,
  },
}
```

# Modules

## User Authentication

### Login
*Note:* This method is still under development, waiting for `getUser()` to be completed.

Method: `login(email, password)`

Returns: Promise

- Resolve: user object on success

#### Example

```javascript
import { login } from 'server/user-auth';
const email = "test.person@email.com";
const password = "secureP@$$word";
login(email, password).then((userData) => {
  console.log('Logged in!');
}).catch((reason) => {
  console.log("Could not login with reason", reason);
});
```

### Logout

Method: `logout()`

Returns: None

#### Example

```javascript
import { logout } from 'server/user-auth';
logout().catch((reason) => {
  console.log("Could not logout with reason", reason);
});
```
