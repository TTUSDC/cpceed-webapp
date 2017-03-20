// action types

export const UserActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

// Register.js uses AuthStates to set the database values for role.
export const AuthStates = {
  GUEST: 'guest',
  STUDENT: 'student',
  COORDINATOR: 'admin'
};

/*
  This defines permissions for each user type. If you need to define new
  permissions, you must add them as a comma separated key-value pair to
  each of the user types in PermissionStates.
*/
export const PermissionStates = {
  GUEST: {
    viewActivity: false,
    viewAccount: false
  },
  STUDENT: {
    viewActivity: true,
    viewAccount: true
  },
  COORDINATOR: {
    viewActivity: true,
    viewAccount: true
  }
};

// action creators

export const setUserLogin = (user) => {
  return {
    type: UserActionTypes.LOGIN,
    user
  };
}

export const setUserLogout = () => {
  return {
    type: UserActionTypes.LOGOUT
  }
}
