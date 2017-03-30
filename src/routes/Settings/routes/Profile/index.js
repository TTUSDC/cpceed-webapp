import React from 'react';
import {Route} from 'react-router';

import ProfileContainer from './components/ProfileContainer.js';

const profileRoute = (
  <Route path='profile' component={ProfileContainer} />
);

export default profileRoute;
