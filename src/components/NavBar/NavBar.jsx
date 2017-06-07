import React from 'react';
import PropTypes from 'prop-types';

import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import MenuIcon from 'grommet/components/icons/base/Menu';
import UserIcon from 'grommet/components/icons/base/User';
import Anchor from 'grommet/components/Anchor';

import { AuthStates } from 'redux/actions.js';
import AuthContainer from 'components/Auth/AuthContainer.jsx';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
    };

    // Binding ensures that the bound function can access local props
    this.renderAuth = this.renderAuth.bind(this);
    this.authFinished = this.authFinished.bind(this);
  }

  authFinished() {
    this.setState({
      auth: false,
    });
  }

  renderAuth() {
    this.setState({
      auth: true,
    });
  }

  render() {
    let authView = null;
    if (this.state.auth === true) {
      authView = (
        <AuthContainer
          authFinished={this.authFinished}
          authCancelled={this.authFinished}
        />
      );
    }

    let authButton = null;
    /*
      To do a simple compare of JavaScript objects, you must convert
      them to JSON form first.
    */
    if (this.props.user.role === AuthStates.GUEST) {
      authButton = (
        <Button
          label='Sign In'
          primary
          onClick={() => {
            this.renderAuth();
          }}
        />
      );
    } else {
      authButton = (
        <Menu
          dropAlign={{ right: 'right', top: 'top' }}
          icon={
            <Box
              flex
              direction='row'
              responsive={false}
            >
              <Box pad={{ horizontal: 'small' }}>
                {this.props.user.firstName}
              </Box>
              <UserIcon />
            </Box>
          }
        >
          <Anchor
            onClick={() => {
              this.props.navigate('settings/');
            }}
          >
            Settings
          </Anchor>
          <Anchor
            onClick={() => {
              this.props.logout();
            }}
          >
            Logout
          </Anchor>
        </Menu>
      );
    }

    return (
      <div>
        <Header
          fixed
          size='medium'
        >
          <Box
            flex
            direction='row'
            responsive={false}
            pad={{ horizontal: 'small' }}
          >
            <Menu
              icon={<MenuIcon />}
              dropAlign={{ left: 'left', top: 'top' }}
            >
              <Anchor
                onClick={() => {
                  this.props.navigate('/');
                }}
              >
                Events
              </Anchor>
              <Anchor
                onClick={() => {
                  this.props.navigate('/activity');
                }}
              >
                Activity
              </Anchor>
            </Menu>
            <Title>
              CPCEED
            </Title>
            <Box
              flex
              justify='end'
              direction='row'
              responsive={false}
            >
              {authButton}
            </Box>
          </Box>
        </Header>
        {authView}
      </div>
    );
  }
}

NavBar.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
    firstName: PropTypes.string,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

NavBar.defaultProps = {
  user: {
    firstName: '',
  },
};

export default NavBar;
