import React from 'react';
import PropTypes from 'prop-types';

import * as server from 'server';
import store from 'redux/store.js';
import { updateUser } from 'redux/actions.js';

import {
  coordinator,
  student,
  AuthStates,
} from 'redux/actions.js';
import logger from 'logger.js';
import Auth from './Auth.jsx';

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logErr: '',
      regErr: '',
      waiting: false,
    };

    /*
      Only functions that are being passed out of this scope, as in the case
      of passing props to children, need to be bound. This ensures that they
      can still access the scope of this component even though they are
      being called from another component.
    */
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleRegister(data) {
    this.setState({
      waiting: true,
      regErr: '',
    });

    let userData;
    switch (data.role) {
      case AuthStates.COORDINATOR:
        userData = coordinator;
        break;
      case AuthStates.STUDENT:
        userData = student;
        break;
      default:
        logger.error('Unknown user role in AuthContainer.js');
    }

    userData.email = data.email;
    userData.name = data.name;

    server.createUser(data)
      .then(() => {
        logger.info('User was registered');

        return server.login(data.email, data.password);
      })
      .then(() => {
        logger.info('User was logged in');

        if (this.props.authFinished) {
          this.props.authFinished();
        }
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          regErr: e.message,
          waiting: false,
        });
      });
  }

  handleLogin(email, password) {
    this.setState({
      waiting: true,
      logErr: '',
    });

    server.login(email, password)
      .then(token => server.getUser(token.id))
      .then((user) => {
        logger.info('User was logged in');

        store.dispatch(updateUser(user));

        if (this.props.authFinished) {
          this.props.authFinished();
        }
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          logErr: e.message,
          waiting: false,
        });
      });
  }

  render() {
    return (
      <Auth
        handleRegister={this.handleRegister}
        handleLogin={this.handleLogin}
        authCancelled={this.props.authCancelled}
        regErr={this.state.regErr}
        logErr={this.state.logErr}
        waiting={this.state.waiting}
      />
    );
  }
}

AuthContainer.propTypes = {
  authFinished: PropTypes.func,
  authCancelled: PropTypes.func.isRequired,
};

AuthContainer.defaultProps = {
  authFinished: null,
};

export default AuthContainer;
