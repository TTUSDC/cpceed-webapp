import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import config from './firebase-config.js';
import appRoute from './app-route.js';
import cpceedApp from 'redux/reducers.js';
import logger from 'logger/logger.js';

import init from 'server/server';

init();

// store holds the redux store that allows app-wide state to be shared
const store = createStore(cpceedApp);
logger.info('SERVER', init);
// logger.info('AUTH', server.auth);
const App = () => (
  // Provider shares store with components joined by connect()
  <Provider store={store}>
    <Router history={hashHistory} routes={appRoute}/>
  </Provider>
);

export {store};
export default App;
