// action types

export const UserActionTypes = {
  UPDATE: 'UPDATE',
  LOGOUT: 'LOGOUT',
};

// Register.js uses AuthStates to set the database values for role.
export const AuthStates = {
  GUEST: 'guest',
  STUDENT: 'student',
  COORDINATOR: 'admin',
};

/*
  This defines permissions for each user type. If you need to define new
  permissions, you must add them as a comma separated key-value pair to
  each of the user types in PermissionStates.
*/
export const PermissionStates = {
  GUEST: {
    viewActivity: false,
    viewSettings: false,
  },
  STUDENT: {
    viewActivity: true,
    viewSettings: true,
  },
  COORDINATOR: {
    viewActivity: true,
    viewSettings: true,
  },
};

export const coordinator = {
  email: '',
  name: '',
  role: AuthStates.COORDINATOR,
};

export const student = {
  approvalStatus: false,
  email: '',
  name: '',
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
    misc: 0,
  },
  role: AuthStates.STUDENT,
};

export const guest = {
  role: AuthStates.GUEST,
};

// action creators

export function updateUser(user) {
  return {
    type: UserActionTypes.UPDATE,
    user,
  };
}

export function logoutUser() {
  const user = guest;

  return {
    type: UserActionTypes.LOGOUT,
    user,
  };
}
