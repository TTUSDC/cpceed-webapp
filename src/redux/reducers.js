import logger from 'logger/logger.js';
import {
  AuthStates,
  PermissionStates,
  UserActionTypes
} from './actions.js';

const emptyUser = {
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
  role: AuthStates.GUEST,
  permissions: PermissionStates.GUEST
};

const user = (state = emptyUser, action) => {
  switch(action.type) {
    case UserActionTypes.LOGIN:
      var permissions = null;

      switch(action.user.role) {
        case AuthStates.GUEST:
          permissions = PermissionStates.GUEST;

          break;
        case AuthStates.STUDENT:
          permissions = PermissionStates.STUDENT;

          break;
        case AuthStates.COORDINATOR:
          permissions = PermissionStates.COORDINATOR;

          break;
        default:
          logger.error('Unknown user role in reducers.js');
      };

      return {
        approvalStatus: action.user.approvalStatus,
        email: action.user.email,
        firstName: action.user.firstName,
        lastName: action.user.lastName,
        studentId: action.user.studentId,
        points: {
          career: action.user.points.career,
          community: action.user.points.community,
          firstother: action.user.points.firstother,
          firstworkshops: action.user.points.firstworkshops,
          mentor: action.user.points.mentor,
          other: action.user.points.other,
          outreach: action.user.points.outreach,
          professor: action.user.points.professor,
          staff: action.user.points.staff,
          misc: action.user.points.misc
        },
        role: action.user.role,
        permissions: permissions
      };
    case UserActionTypes.LOGOUT:
      return emptyUser;
    default:
      return state;
  };
}

const cpceedApp = (state = {}, action) => {
  return {
    user: user(state.user, action)
  };
}

export default cpceedApp;
