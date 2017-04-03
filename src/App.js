import React from 'react';
import * as server from 'server/server';
import * as firebase from "firebase";
import { Router, Route, hashHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import config from './firebase-config.js';
import appRoute from './app-route.js';
import cpceedApp from 'redux/reducers.js';
import logger from 'logger/logger.js';
import * as auth from 'server/user-auth';

// Connects the app to firebase
firebase.initializeApp(config);
// server.init();
// store holds the redux store that allows app-wide state to be shared
const store = createStore(cpceedApp);
logger.info('SERVER', server);
logger.info('AUTH', auth);
const App = () => (
  // Provider shares store with components joined by connect()
  <Provider store={store}>
    <Router history={hashHistory} routes={appRoute}/>
  </Provider>
);

export {store};
export default App;
