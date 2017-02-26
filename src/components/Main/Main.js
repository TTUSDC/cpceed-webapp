import React from 'react';

import App from 'grommet/components/App';
import Box from 'grommet/components/Box';

import NavBarContainer from 'components/NavBar/NavBarContainer.js';

class Main extends React.Component {
  render() {
    return (
      <App
        centered={false}
        inline={false}>
        <Box full={true}>
          <NavBarContainer/>
          {this.props.children}
        </Box>
      </App>
    );
  }
}

export default Main;
