import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Nav from './routes/Guest/components/Nav'
import Coordinator from './routes/Coordinator'

const rootRoute = {
    path: '/',

    getIndexRoute(partialNextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('./routes/Guest'))
        })
    },

    getChildRoutes(partialNextState, callback) {
        require.ensure([], (require) => {
            callback(null, [
                require('./routes/Coordinator')
            ])
        })
    }
}

render(
  (<Router history={hashHistory} routes={rootRoute}/>),
  document.getElementById('app')
)
