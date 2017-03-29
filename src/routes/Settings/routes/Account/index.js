import React from 'react';
import {Route} from 'react-router';

import AccountContainer from './components/AccountContainer.js';

const accountRoute = (
  <Route path='account' component={AccountContainer} />
);

export default accountRoute;
