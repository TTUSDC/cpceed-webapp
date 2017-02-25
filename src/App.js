import React from 'react';
import * as firebase from "firebase";
import { Router, Route, hashHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import config from './firebaseConfig.js';
import appRoute from './appRoute.js';
import cpceedApp from 'redux/reducers.js';

// Connects the app to firebase
firebase.initializeApp(config);
// store holds the redux store that allows app-wide state to be shared
const store = createStore(cpceedApp);

const App = () => (
    // Provider shares store with components joined by connect()
    <Provider store={store}>
        <Router history={hashHistory} routes={appRoute}/>
    </Provider>
);

export default App;
