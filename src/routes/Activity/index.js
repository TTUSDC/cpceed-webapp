import React from 'react';
import { Route } from 'react-router';

import Activity from './components/Activity.js';

const activityRoute = (
    <Route path='activity' component={Activity} />
);

export default activityRoute;
