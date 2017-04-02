import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCtMk74zXBsAYRYIzamcyRXyGDFP3vKXhA',
  authDomain: 'testing-project-a5d42.firebaseapp.com',
  databaseURL: 'https://testing-project-a5d42.firebaseio.com/',
};


const init = () => {
  firebase.initializeApp(firebaseConfig);
};


export default init;
