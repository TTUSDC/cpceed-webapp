const loginRoute = {
    path: 'login/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Login').default)
        })
    }
}

export default loginRoute;
