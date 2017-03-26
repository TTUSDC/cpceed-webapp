import React from 'react';
import {withRouter} from 'react-router';

import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';

import RequireAuth from 'components/Auth/RequireAuth.js';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };

    this.navigate = this.navigate.bind(this);
  }

  navigate(url) {
    this.props.router.push(url);
  }

  render() {
    return (
      <Box>
        <Header
          fixed={false}
          size='medium'
          justify='center'
          flex={true}
          direction='row'
          responsive={false}
          pad={{between: "small"}}>
          <Button
            label='Profile'
            primary={false}
            onClick={() => {this.navigate('/settings/profile')}}/>
          <Button
            label='Account'
            primary={false}
            onClick={() => {this.navigate('/settings/account')}}/>
        </Header>
        {this.props.children}
      </Box>
    );
  }
}

const requiredState = {
  viewSettings: true
};

/*
  Testing components wrapped in HOCs is slightly more complicated than
  normal. Since each component is tested in a vacuum the HOC won't work
  properly. So you have to have a pure export for testing purposes.
*/
export { Settings };
// The permissions object is passed as the second argument to RequireAuth
export default withRouter(RequireAuth(Settings, requiredState));
