import { SET_AUTH_STATE, AuthStates } from './actions.js';

const authState = (state = AuthStates.GUEST, action) => {
    switch(action.type) {
        case SET_AUTH_STATE:
            return Object.assign({}, state, {
                authState: action.authState
            });
        default:
            return state;
    }
}

const cpceedApp = (state = {}, action) => {
    return {
        authState: authState(state.authState, action)
    }
}

export default cpceedApp;
