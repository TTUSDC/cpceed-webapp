module.exports = {
    path: 'Login/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/Login'))
        })
    }
}
