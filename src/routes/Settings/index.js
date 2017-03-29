import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import Settings from './components/Settings.js';
import accountRoute from './routes/Account';
import profileRoute from './routes/Profile';

const settingsRoute = (
  <Route path='settings/' component={Settings}>
    <IndexRedirect to='profile/' />

    {accountRoute}
    {profileRoute}
  </Route>
);

export default settingsRoute;
