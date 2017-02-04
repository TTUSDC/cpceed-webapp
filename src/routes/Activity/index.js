const activityRoute = {
    path: 'activity/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Activity.js').default)
        })
    }
}

export default activityRoute;
