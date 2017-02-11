import React from 'react';
import { Route } from 'react-router';

import Events from './components/Events.js';

const eventsRoute = (
    <Route path='events' component={Events} />
);

export default eventsRoute;
