module.exports = {
    path: 'Register/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Register'))
        })
    }
}
