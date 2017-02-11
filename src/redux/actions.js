// action types

export const SET_AUTH_STATE = 'SET_AUTH_STATE';

/*
    Auth.js sets the database values for role, so AuthStates should be kept
    in sync with it.
*/
export const AuthStates = {
    GUEST: 'guest',
    STUDENT: 'student',
    COORDINATOR: 'admin'
}

// action creators

export const setAuthState = (authState) => {
    return {
        type: SET_AUTH_STATE,
        authState
    }
}
