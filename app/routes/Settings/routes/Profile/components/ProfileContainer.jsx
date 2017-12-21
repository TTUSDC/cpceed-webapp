import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as server from 'server';
import { updateUser } from 'redux/actions.js';
import logger from 'logger.js';
import Profile from './Profile.jsx';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proErr: '',
      waiting: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.setState({
      waiting: true,
      proErr: '',
    });

    server.modifyUser(data, this.props.user.uid)
      .then((newUser) => {
        logger.info('User data was updated');

        // Update user in the redux store
        this.props.dispatch(updateUser(newUser));

        this.setState({
          waiting: false,
        });
      })
      .catch((e) => {
        logger.error(e.message);
        this.setState({
          waiting: false,
          proErr: e.message,
        });
      });
  }

  render() {
    return (
      <Profile
        name={this.props.user.name}
        proErr={this.state.proErr}
        waiting={this.state.waiting}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

ProfileContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(ProfileContainer);
