import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';

import RequireAuth from 'components/Auth/RequireAuth.js';
import AccountContainer from './routes/Account';
import ProfileContainer from './routes/Profile';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.navigate = this.navigate.bind(this);
  }

  navigate(url) {
    this.props.history.push(url);
  }

  render() {
    return (
      <Box>
        <Header
          fixed={false}
          size='medium'
          justify='center'
          flex
          direction='row'
          responsive={false}
          pad={{ between: 'small' }}
        >
          <Button
            label='Profile'
            primary={false}
            onClick={() => {
              this.navigate('/settings/profile');
            }}
          />
          <Button
            label='Account'
            primary={false}
            onClick={() => {
              this.navigate('/settings/account');
            }}
          />
        </Header>

        <Route
          exact
          path='/settings'
          render={() => (
            <Redirect to='/settings/profile' />
          )}
        />

        <Route path='/settings/profile' component={AccountContainer} />
        <Route path='/settings/account' component={ProfileContainer} />
      </Box>
    );
  }
}

Settings.propTypes = {
  history: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }).isRequired,
};

const requiredState = {
  viewSettings: true,
};

/*
  Testing components wrapped in HOCs is slightly more complicated than
  normal. Since each component is tested in a vacuum the HOC won't work
  properly. So you have to have a pure export for testing purposes.
*/
export { Settings };
// The permissions object is passed as the second argument to RequireAuth
export default RequireAuth(Settings, requiredState);
