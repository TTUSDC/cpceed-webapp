const eventsRoute = {
    path: 'events/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Events.js').default)
        })
    }
}

export default eventsRoute;
