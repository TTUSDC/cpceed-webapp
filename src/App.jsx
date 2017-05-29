import React from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import GrommetApp from 'grommet/components/App';
import Box from 'grommet/components/Box';

import init from 'server/server';
import cpceedApp from 'redux/reducers.js';
import NavBarContainer from 'components/NavBar/NavBarContainer.js';
import Events from 'routes/Events';
import Activity from 'routes/Activity';
import Settings from 'routes/Settings';

init();

// store holds the redux store that allows app-wide state to be shared
const store = createStore(cpceedApp);

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

export { store };
export default App;
