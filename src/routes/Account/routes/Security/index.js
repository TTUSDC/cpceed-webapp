import React from 'react';
import {Route} from 'react-router';

import SecurityContainer from './components/SecurityContainer.js';

const securityRoute = (
  <Route path='security' component={SecurityContainer} />
);

export default securityRoute;
