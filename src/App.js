import React from 'react';
import { Router, hashHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import init from 'server/server';
import cpceedApp from 'redux/reducers.js';
import appRoute from './app-route.js';
// import logger from 'logger/logger.js';

init();

// store holds the redux store that allows app-wide state to be shared
const store = createStore(cpceedApp);
// logger.info('SERVER', init);
const App = () => (
  // Provider shares store with components joined by connect()
  <Provider store={store}>
    <Router history={hashHistory} routes={appRoute}/>
  </Provider>
);

export { store };
export default App;
