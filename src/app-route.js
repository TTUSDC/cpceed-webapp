import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import MainContainer from './components/Main/MainContainer';
import eventsRoute from './routes/Events';
import activityRoute from './routes/Activity';
import accountRoute from './routes/Account';

const appRoute = (
  // Sets the path and primary component for this route
  <Route path='/' component={MainContainer}>
    {/* Load the events page by default */}
    <IndexRedirect to='events' />

    {/* Set the children of the primary component */}
    {eventsRoute}
    {activityRoute}
    {accountRoute}
  </Route>
);

export default appRoute;
