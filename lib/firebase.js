import firebase from 'firebase/app';
import  'firebase/auth';
import  'firebase/firestore';
import  'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAgu4Z9n_x8U9QgvMzj-jpGtvtX6OfBP6Q",
    authDomain: "fireship-blog-react-firebase.firebaseapp.com",
    projectId: "fireship-blog-react-firebase",
    storageBucket: "fireship-blog-react-firebase.appspot.com",
    messagingSenderId: "877791210413",
    appId: "1:877791210413:web:65580cc214ead2e4400f24",
    measurementId: "G-BPJZGYRGND"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  export const firestore = firebase.firestore();
  export const storage= firebase.storage();