import React from 'react';
import { withRouter } from 'react-router';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { setAuthState } from '../../../redux/actions.js';
import Register from './Register.js';

class RegisterContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    navigate(url) {
        this.props.router.push(url);
    }

    // Doesn't currently account for non-student users
    handleSubmit(email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                console.log("User was registered");

                // Would have to have a separate variable for user type
                firebase.database().ref().child('users/' + user.uid).set({
                    type: 'STUDENT'
                }).then(() => {
                    console.log("User data was created");

                    this.props.dispatch(setAuthState('STUDENT'));
                }).catch((e) => {
                    console.log(e.message);
                });
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    render() {
        return (
            <Register handleSubmit={this.handleSubmit}/>
        );
    }
}

export default connect()(withRouter(RegisterContainer));
