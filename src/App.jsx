import React from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import GrommetApp from 'grommet/components/App';
import Box from 'grommet/components/Box';

import init from 'server/server';
import NavBarContainer from 'components/NavBar/NavBarContainer.jsx';
import Events from 'routes/Events';
import Activity from 'routes/Activity';
import Settings from 'routes/Settings';
import store from 'redux/store.js';

init();

const App = () => (
  // Provider shares store with components joined by connect()
  <Provider store={store}>
    <HashRouter>
      <GrommetApp
        centered={false}
        inline={false}
      >
        <Box full>
          <NavBarContainer />

          {/* Load the events page by default */}
          <Route
            exact
            path='/'
            render={() => (
              <Redirect to='/events' />
            )}
          />

          {/* Set the children of the primary component */}
          <Route path='/events' component={Events} />
          <Route path='/activity' component={Activity} />
          <Route path='/settings' component={Settings} />
        </Box>
      </GrommetApp>
    </HashRouter>
  </Provider>
);

export default App;
