// action types

export const SET_AUTH_STATE = 'SET_AUTH_STATE';

export const AuthStates = {
    GUEST: 'GUEST',
    STUDENT: 'STUDENT',
    COORDINATOR: 'COORDINATOR'
}

// action creators

export const setAuthState = (authState) => {
    return {
        type: SET_AUTH_STATE,
        authState
    }
}
