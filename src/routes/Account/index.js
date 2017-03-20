import React from 'react';
import { Route } from 'react-router';

import Account from './components/Account.js';

const accountRoute = (
  <Route path='account' component={Account} />
);

export default accountRoute;
