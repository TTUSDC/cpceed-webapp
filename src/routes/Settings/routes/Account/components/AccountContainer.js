import React from 'react';
import * as firebase from 'firebase';

import Account from './Account.js';
import logger from 'logger/logger.js';

class AccountContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secErr: '',
      waiting: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(password) {
    this.setState({
      waiting: true,
      secErr: ''
    });

    var user = firebase.auth().currentUser;
    user.updatePassword(password)
      .then(() => {
        logger.info('Password was changed');
        this.setState({
          waiting: false
        });
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          waiting: false,
          secErr: e.message
        });
      });
  }

  render() {
    return (
      <Account
        handleSubmit={this.handleSubmit}
        waiting={this.state.waiting}
        secErr={this.state.secErr}/>
    );
  }
}

export default AccountContainer;
