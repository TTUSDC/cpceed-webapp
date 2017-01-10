import React from 'react';
import * as firebase from "firebase";
import { connect } from 'react-redux';
import { setAuthState } from 'redux/actions.js';
import App from './App.js';

var config = {
    apiKey: "AIzaSyCtMk74zXBsAYRYIzamcyRXyGDFP3vKXhA",
    authDomain: "testing-project-a5d42.firebaseapp.com",
    databaseURL: "https://testing-project-a5d42.firebaseio.com/"
};
firebase.initializeApp(config);

class AppContainer extends React.Component {
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
                (App.js) must be composed by the container (AppContainer.js).
                However, this means that the children must be passed as props
                to App.js, as it is not connected to the router directly.
            */
            <App children={this.props.children}/>
        );
    }
}

export default connect()(AppContainer);
