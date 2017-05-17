import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import {
  updateUser,
  coordinator,
  student,
  AuthStates
} from 'redux/actions.js';
import logger from 'logger/logger.js';
import Auth from './Auth.js';

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logErr: '',
      regErr: '',
      waiting: false
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
      regErr: ''
    });

    var userData = {};
    switch(data.role) {
      case AuthStates.COORDINATOR:
        userData = coordinator;

        break;
      case AuthStates.STUDENT:
        userData = student;

        userData.studentId = data.studentId;

        break;
      default:
        logger.error('Unknown user role in AuthContainer.js');
    };

    userData.email = data.email;
    userData.firstName = data.firstName;
    userData.lastName = data.lastName;

    firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        return firebase.database().ref().child('users/' + user.uid)
          .set(userData);
      })
      .then(() => {
        logger.info('User was registered');

        this.props.dispatch(updateUser(userData));

        if(this.props.authFinished) {
          this.props.authFinished();
        }
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          regErr: e.message,
          waiting: false
        });
      });
  }

  handleLogin(email, password) {
    this.setState({
      waiting: true,
      logErr: ''
    });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        const rootRef = firebase.database().ref();
        const userRef = rootRef.child('users/' + user.uid);

        userRef.once('value')
          .then((snapshot) => {
            logger.info('User was logged in');

            this.props.dispatch(updateUser(snapshot.val()));

            if(this.props.authFinished) {
              this.props.authFinished();
            }
          });
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          logErr: e.message,
          waiting: false
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
        waiting={this.state.waiting} />
    );
  }
}

AuthContainer.propTypes = {
  authFinished: React.PropTypes.func,
  authCancelled: React.PropTypes.func.isRequired
}

export default connect()(withRouter(AuthContainer));
