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

function NavBar(props) {
  let authView = null;
  if (props.auth === true) {
    authView = (
      <AuthContainer
        authFinished={props.toggleAuth}
        authCancelled={props.toggleAuth}
      />
    );
  }

  let authButton = null;
  if (props.user.role === AuthStates.GUEST) {
    authButton = (
      <Button
        label='Sign In'
        primary
        onClick={props.toggleAuth}
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
            <UserIcon />
          </Box>
        }
      >
        <Anchor disabled>
          {props.user.firstName}
        </Anchor>
        <Anchor onClick={() => props.navigate('settings/')}>
          Settings
        </Anchor>
        <Anchor onClick={() => props.logout()}>
          Logout
        </Anchor>
      </Menu>
    );
  }

  return (
    <div>
      <Header
        fixed
        flex
        direction='row'
        responsive={false}
        pad={{ horizontal: 'small' }}
      >
        <Menu
          icon={<MenuIcon />}
          dropAlign={{ left: 'left', top: 'top' }}
        >
          <Anchor onClick={() => props.navigate('/')}>
            Events
          </Anchor>
          <Anchor
            onClick={() => props.navigate('/activity')}
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
          pad='small'
        >
          {authButton}
        </Box>
      </Header>
      {authView}
    </div>
  );
}

NavBar.propTypes = {
  auth: PropTypes.bool.isRequired,
  toggleAuth: PropTypes.func.isRequired,
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
