const registerRoute = {
    path: 'register/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Register').default)
        })
    }
}

export default registerRoute;
