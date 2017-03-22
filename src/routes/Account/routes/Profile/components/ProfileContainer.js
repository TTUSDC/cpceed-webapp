import React from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

import Profile from './Profile.js';
import {updateUser} from 'redux/actions.js';
import logger from 'logger/logger.js';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proErr: '',
      waiting: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.setState({
      waiting: true,
      proErr: ''
    });

    var user = firebase.auth().currentUser;
    const userRef = firebase.database().ref().child('users/' + user.uid);

    if('email' in data) {
      user.updateEmail(data.email)
        .then(() => {
          logger.info('Email was updated');
        })
        .catch((e) => {
          logger.error(e.message);
        });
    }

    userRef.update(data)
      .then(() => {
        logger.info('User data was updated');

        // Make newUser from user in the redux store
        var newUser = this.props.user;
        for(var key in data) {
          if(!data.hasOwnProperty(key)) {
            continue;
          }

          // If a value was altered, put the new value in newUser
          newUser[key] = data[key];
        }
        // Update user in the redux store
        this.props.dispatch(updateUser(newUser));

        this.setState({
          waiting: false
        });
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          waiting: false,
          proErr: e.message
        });
      });
  }

  render() {
    return (
      <Profile
        lastName={this.props.user.lastName}
        firstName={this.props.user.firstName}
        email={this.props.user.email}
        proErr={this.state.proErr}
        waiting={this.state.waiting}
        handleSubmit={this.handleSubmit}/>
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

export default connect(mapStateToProps)(ProfileContainer);
