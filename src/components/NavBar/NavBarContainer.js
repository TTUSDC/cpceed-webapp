import React from 'react';
import { withRouter } from 'react-router';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { setAuthState, AuthStates } from 'redux/actions.js';
import NavBar from './NavBar.js';

class NavBarContainer extends React.Component {
    constructor(props) {
        super(props);

        /*
            navigate needs to be bound to the context of NavBarContainer to
            access the router, since it is being called from NavBar.js.
        */
        this.navigate = this.navigate.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Navigate by pushing the relative URL to the router
    navigate(url) {
        this.props.router.push(url);
    }

    logout() {
        firebase.auth().signOut()
            .then(() => {
                console.log("User was signed out");

                // Set permissions to guest
                this.props.dispatch(setAuthState(AuthStates.GUEST));
            })
            .catch((e) => {
                console.log(e.message);
            });

        this.props.router.push('/');
    }

    render() {
        return (
            /*
                As a presenter, NavBar.js isn't allowed to modify data; this
                includes the router. To maintain the paradigm, the navigate
                function is passed to NavBar.js as a prop. When it is called
                from NavBar.js, the context switches back to NavBarContainer.js.
            */
            <NavBar
                permissions={this.props.permissions}
                navigate={this.navigate}
                logout={this.logout}/>
        );
    }
}

// Used by mapStateToProps to get permissions from the redux store
const getPermissions = (permissions) => {
    return permissions;
}

// Used by connect to map permissions to this.props.permissions
const mapStateToProps = (state) => {
    return {
        permissions: getPermissions(state.permissions)
    }
}

export default connect(mapStateToProps)(withRouter(NavBarContainer));
