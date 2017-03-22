// action types

export const UserActionTypes = {
  UPDATE: 'UPDATE',
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

export var coordinator = {
  email: '',
  firstName: '',
  lastName: '',
  role: AuthStates.COORDINATOR
};

export var student = {
  approvalStatus: false,
  email: '',
  firstName: '',
  lastName: '',
  studentId: '',
  points: {
    career: 0,
    community: 0,
    firstother: 0,
    firstworkshops: 0,
    mentor: 0,
    other: 0,
    outreach: 0,
    professor: 0,
    staff: 0,
    misc: 0
  },
  role: AuthStates.STUDENT
};

export var guest = {
  role: AuthStates.GUEST
};

// action creators

export const updateUser = (user) => {
  return {
    type: UserActionTypes.UPDATE,
    user
  };
}

export const logoutUser = () => {
  var user = guest;

  return {
    type: UserActionTypes.LOGOUT,
    user
  };
}
