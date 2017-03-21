import React from 'react';
import {Route, IndexRedirect} from 'react-router';

import Account from './components/Account.js';
import securityRoute from './routes/Security';
import profileRoute from './routes/Profile';

const accountRoute = (
  <Route path='account/' component={Account}>
    <IndexRedirect to='profile/' />

    {securityRoute}
    {profileRoute}
  </Route>
);

export default accountRoute;
