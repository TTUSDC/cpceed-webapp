import React from 'react';
import * as firebase from "firebase";
import { connect } from 'react-redux';

import { setAuthState, AuthStates } from 'redux/actions.js';
import Main from './Main.js';

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

      this.props.dispatch(setAuthState(AuthStates.GUEST));
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
