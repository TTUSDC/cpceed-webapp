module.exports = {
    path: 'Guest/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Nav'))
        })
    },

    getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
            callback(null, [
                require('./routes/Register'),
                require('./routes/Login')
            ])
        })
    }
}
