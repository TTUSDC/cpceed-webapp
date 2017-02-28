import { AuthActionTypes, PermissionStates } from './actions.js';

const permissions = (state = PermissionStates.GUEST, action) => {
  switch(action.type) {
    case AuthActionTypes.GUEST:
      return PermissionStates.GUEST;
    case AuthActionTypes.STUDENT:
      return PermissionStates.STUDENT;
    case AuthActionTypes.COORDINATOR:
      return PermissionStates.COORDINATOR;
    default:
      return state;
  };
};

const cpceedApp = (state = {}, action) => {
  return {
    permissions: permissions(state.permissions, action)
  };
};

export default cpceedApp;
