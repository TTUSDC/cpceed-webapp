const appRoute = {
    /*
        Each of the key-value pairs separated by commas represent a prop. To
        add additional props, simply add another key-value pair. These props
        can be accessed through this.props.route.prop (where prop is the key
        in the new key-value pair) in the component that "getComponent" is
        targeting.
    */

    // Holds the value of the relative path from the parent route
    path: '/',

    // Sets the primary component for this route
    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Main/MainContainer').default)
        })
    },

    // Load the events page by default
    getIndexRoute(partialNextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./routes/Events').default)
        })
    },

    // Sets the children of the primary component
    getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
            callback(null, [
                require('./routes/Events').default,
                require('./routes/Activity').default
            ])
        })
    }
};

export default appRoute;
