import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { setAuthState } from 'redux/actions.js';
import Auth from './Auth.js';

class AuthContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleRegister(data) {
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
            .then((user) => {
                firebase.database().ref().child('users/' + user.uid).set({
                    approvalStatus: false,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    points: 0,
                    studentId: data.studentID,
                    role: data.role
                })
                    .then(() => {
                        console.log("User was registered");

                        this.props.dispatch(setAuthState(data.role));

                        if(this.props.authFinished) {
                            this.props.authFinished();
                        }
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    handleLogin(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                const rootRef = firebase.database().ref();
                const userRef = rootRef.child('users/' + user.uid + '/role');

                userRef.once('value')
                    .then((snapshot) => {
                        console.log("User was logged in");

                        this.props.dispatch(setAuthState(snapshot.val()));

                        if(this.props.authFinished) {
                            this.props.authFinished();
                        }
                    });
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    render() {
        return (
            <Auth
                handleRegister={this.handleRegister}
                handleLogin={this.handleLogin}
                authCancelled={this.props.authCancelled}/>
        );
    }
}

AuthContainer.propTypes = {
    authFinished: React.PropTypes.func,
    authCancelled: React.PropTypes.func.isRequired
}

export default connect()(withRouter(AuthContainer));
