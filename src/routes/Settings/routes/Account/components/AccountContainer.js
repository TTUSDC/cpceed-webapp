import React from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';
import update from 'immutability-helper';

import Account from './Account.js';
import {updateUser} from 'redux/actions.js';
import logger from 'logger/logger.js';

class AccountContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: {
        email: '',
        password: ''
      },
      waiting: {
        email: false,
        password: false
      }
    };

    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }

  handlePassword(password, old) {
    // TODO (Nils) utilize the old password

    this.setState({
      waiting: update(this.state.waiting, {
        password: {$set: true}
      }),
      err: update(this.state.err, {
        password: {$set: ''}
      })
    });

    var user = firebase.auth().currentUser;
    user.updatePassword(password)
      .then(() => {
        logger.info('Password was changed');
        this.setState({
          waiting: update(this.state.waiting, {
            password: {$set: false}
          })
        });
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          waiting: update(this.state.waiting, {
            password: {$set: false}
          }),
          err: update(this.state.err, {
            password: {$set: e.message}
          })
        });
      });
  }

  handleEmail(email) {
    this.setState({
      waiting: update(this.state.waiting, {
        email: {$set: true}
      }),
      err: update(this.state.err, {
        email: {$set: ''}
      })
    });

    var user = firebase.auth().currentUser;
    const userRef = firebase.database().ref().child('users/' + user.uid);

    user.updateEmail(email)
      .then(() => {
        return userRef.update({
          email: email
        });
      })
      .then(() => {
        logger.info('Email was updated');

        var newUser = this.props.user;
        newUser.email = email;
        this.props.dispatch(updateUser(newUser));

        this.setState({
          waiting: update(this.state.waiting, {
            email: {$set: false}
          })
        });
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          waiting: update(this.state.waiting, {
            email: {$set: false}
          }),
          err: update(this.state.err, {
            email: {$set: e.message}
          })
        });
      });
  }

  render() {
    return (
      <Account
        handlePassword={this.handlePassword}
        handleEmail={this.handleEmail}
        user={this.props.user}
        waiting={this.state.waiting}
        err={this.state.err}/>
    );
  }
}

const getUser = (user) => {
  return user;
}

const mapStateToProps = (state) => {
  return {
    user: getUser(state.user)
  }
}

export default connect(mapStateToProps)(AccountContainer);
