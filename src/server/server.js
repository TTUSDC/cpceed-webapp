import * as firebase from 'firebase';
import logger from 'logger/logger';
const firebaseConfig = {
  apiKey: 'AIzaSyCtMk74zXBsAYRYIzamcyRXyGDFP3vKXhA',
  authDomain: 'testing-project-a5d42.firebaseapp.com',
  databaseURL: 'https://testing-project-a5d42.firebaseio.com/',
};

export default function init() {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    logger.warn('Firebase may not have started.', err);
  }
}

