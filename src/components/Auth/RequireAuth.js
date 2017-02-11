import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AuthStates } from 'redux/actions.js';
import AuthContainer from './AuthContainer.js';

const requireAuth = (WrappedComponent, requiredState) => {
    class AuthWrapper extends WrappedComponent {
        constructor(props) {
            super(props);

            this.authCancelled = this.authCancelled.bind(this);
        }

        authCancelled() {
            this.props.router.goBack();
        }

        render() {
            if(this.props.authState === requiredState) {
                return super.render();
            } else {
                return <AuthContainer authCancelled={this.authCancelled} />;
            }
        }
    }

    const getAuthState = (authState) => {
        return authState;
    }

    const mapStateToProps = (state) => {
        return {
            authState: getAuthState(state.authState)
        }
    }

    return connect(mapStateToProps)(withRouter(AuthWrapper));
}

export default requireAuth;
