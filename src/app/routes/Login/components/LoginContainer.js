import React from 'react';
import { withRouter } from 'react-router';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { setAuthState } from '../../../redux/actions.js';
import Login from './Login.js';

class LoginContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    navigate(url) {
        this.props.router.push(url);
    }

    handleSubmit(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log("User was logged in");

                const rootRef = firebase.database().ref();
                const userRef = rootRef.child('users/' + user.uid + '/type');
                userRef.once('value').then((type) => {
                    console.log("Redux state was set")

                    this.props.dispatch(setAuthState(type.val()));
                });
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    render() {
        return (
            <Login handleSubmit={this.handleSubmit}/>
        );
    }
}

export default connect()(withRouter(LoginContainer));
