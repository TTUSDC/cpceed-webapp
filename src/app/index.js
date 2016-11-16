import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'

const appRoute = {
    path: '/',

    getComponent(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./components/NavBar'))
        })
    },

    // getIndexRoute(partialNextState, callback) {
    //     require.ensure([], (require) => {
    //         callback(null, require('./routes/Login'))
    //     })
    // },

    getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
            callback(null, [
                require('./routes/Register'),
                require('./routes/Login')
            ])
        })
    }
}

render((
  <Router history={hashHistory} routes={appRoute}/>
), document.getElementById('app'))
