import React from 'react';
import * as firebase from "firebase";
import { connect } from 'react-redux';

import { setAuthState } from 'redux/actions.js';
import Main from './Main.js';

var config = {
    apiKey: "AIzaSyCtMk74zXBsAYRYIzamcyRXyGDFP3vKXhA",
    authDomain: "testing-project-a5d42.firebaseapp.com",
    databaseURL: "https://testing-project-a5d42.firebaseio.com/"
};
firebase.initializeApp(config);

class MainContainer extends React.Component {
    constructor(props) {
        super(props);

        // Check for already authenticated users
        var user = firebase.auth().currentUser;

        if(user) {
            // Look for the type of the user (coordinator or student)
            console.log("A user was already signed in");

            const rootRef = firebase.database().ref();
            const userRef = rootRef.child('users/' + user.uid + '/type');
            userRef.once('value').then((type) => {
                this.props.dispatch(setAuthState(type.val()));
            });
        } else {
            // User is a guest
            console.log("No pre-existing users");

            this.props.dispatch(setAuthState('GUEST'));
        }
    }

    render() {
        return (
            /*
                The container-presenter model dicates that the presenter
                (Main.js) must be composed by the container
                (MainContainer.js). However, this means that the children
                must be passed as props to Main.js, as it is not connected to
                the router directly.
            */
            <Main children={this.props.children}/>
        );
    }
}

export default connect()(MainContainer);
