import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import AuthContainer from './AuthContainer.js';

const requireAuth = (WrappedComponent, requiredState) => {
  class AuthWrapper extends WrappedComponent {
    constructor(props) {
      super(props);

      this.authCancelled = this.authCancelled.bind(this);
    }

    authCancelled() {
      // If signin is cancelled, go back to the previous page
      this.props.router.goBack();
    }

    render() {
      var authorized = true;

      // Checks if user has the required permissions
      for(var key in requiredState) {
        // Skips properties from prototype
        if(!requiredState.hasOwnProperty(key)) {
          continue;
        }

        if(this.props.permissions[key] !== requiredState[key]) {
          authorized = false;
          break;
        }
      }

      // Depnding on whether the user has the required permissions
      if(authorized === true) {
        // Render the component
        return super.render();
      } else {
        // Display the signin window
        return <AuthContainer authCancelled={this.authCancelled} />;
      }
    }
  }

  const getPermissions = (permissions) => {
    return permissions;
  }

  const mapStateToProps = (state) => {
    return {
      permissions: getPermissions(state.permissions)
    }
  }

  return connect(mapStateToProps)(withRouter(AuthWrapper));
}

export default requireAuth;
