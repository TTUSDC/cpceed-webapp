import React from 'react';

import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import MenuIcon from 'grommet/components/icons/base/Menu';
import UserIcon from 'grommet/components/icons/base/User';
import Anchor from 'grommet/components/Anchor';

import {AuthStates} from 'redux/actions.js';
import AuthContainer from 'components/Auth/AuthContainer.js';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false
    };

    // Binding ensures that the bound function can access local props
    this.renderAuth = this.renderAuth.bind(this);
    this.authFinished = this.authFinished.bind(this);
  }

  renderAuth() {
    this.setState({
      auth: true
    });
  }

  authFinished() {
    this.setState({
      auth: false
    });
  }

  render() {
    var authView = null;
    if(this.state.auth === true) {
      authView = (
        <AuthContainer
          authFinished={this.authFinished}
          authCancelled={this.authFinished} />
      );
    }

    var authButton = null;
    /*
      To do a simple compare of JavaScript objects, you must convert
      them to JSON form first.
    */
    if(this.props.user.role === AuthStates.GUEST) {
      authButton = (
        <Button
          label="Sign In"
          primary={true}
          onClick={() => {
            this.renderAuth();
          }}/>
      );
    } else {
      authButton = (
        <Menu
          dropAlign={{"right": "right", "top": "top"}}
          icon={
            <Box
              flex={true}
              direction='row'
              responsive={false}>
              <Box pad={{horizontal: 'small'}}>
                {this.props.user.firstName}
              </Box>
              <UserIcon />
            </Box>
          }>
            <Anchor onClick={() => {
              this.props.navigate('settings/');
            }}>
              Settings
            </Anchor>
            <Anchor onClick={() => {
              this.props.logout();
            }}>
              Logout
            </Anchor>
        </Menu>
      );
    }

    return (
      <div>
        <Header
          fixed={true}
          size='medium'>
          <Box
            flex={true}
            direction='row'
            responsive={false}
            pad={{"horizontal": "small"}}>
            <Menu
              icon={<MenuIcon />}
              dropAlign={{"left": "left", "top": "top"}}>
                <Anchor onClick={() => {
                  this.props.navigate('/');
                }}>
                  Events
                </Anchor>
                <Anchor onClick={() => {
                  this.props.navigate('activity/');
                }}>
                  Activity
                </Anchor>
            </Menu>
            <Title>
              CPCEED
            </Title>
            <Box
              flex={true}
              justify='end'
              direction='row'
              responsive={false}>
              {authButton}
            </Box>
          </Box>
        </Header>
        {authView}
      </div>
    );
  }
}

export default NavBar;
