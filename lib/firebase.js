// import firebase from 'firebase/compat/app';
// import  'firebase/compat/auth';
// import  'firebase/compat/firestore';
// import  'firebase/compat/storage';


import { initializeApp } from "firebase/app";

import { getAuth,  } from "firebase/auth";
import { getFirestore, 
  collection,
  query,

limit,

where,


getDocs   } from "firebase/firestore";

import {getStorage} from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyAgu4Z9n_x8U9QgvMzj-jpGtvtX6OfBP6Q",
    authDomain: "fireship-blog-react-firebase.firebaseapp.com",
    projectId: "fireship-blog-react-firebase",
    storageBucket: "fireship-blog-react-firebase.appspot.com",
    messagingSenderId: "877791210413",
    appId: "1:877791210413:web:65580cc214ead2e4400f24",
    measurementId: "G-BPJZGYRGND"
  };

  const app = initializeApp(firebaseConfig);

  // if(!firebase.apps.length){
  //   firebase.initializeApp(firebaseConfig);
  // }

// Auth exports
//export const auth = firebase.auth();
export const auth = getAuth(app);
//export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

 // Firestore exports
//export const firestore = firebase.firestore();
export const firestore = getFirestore(app);


//special function which tells firestore
// to save a timestamp on the document on server
//it's better than javascript date as it 
//does not rely on user client side clock
// export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
// export const fromMillis = firebase.firestore.Timestamp.fromMillis;
// export const increment = firebase.firestore.FieldValue.increment;


// export  const serverTimestampFunct = serverTimestamp; 
// export  const fromMillisFunct = fromMillis;
// export  const incrementFunct = increment;

// Storage exports
//export const storage = firebase.storage();
export const storage = getStorage(app);
//special event of firestore which gives progress on file upload
//export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;


  /**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  // const usersRef = firestore.collection('users');
  // const query = usersRef.where('username', '==', username).limit(1);
  // const userDoc = (await query.get()).docs[0];
//console.log('username', username);
  const usersRef =  collection(firestore,'users');
  const q =  query(usersRef, where('username', '==', username), limit(1))
  
  const userSnapshot = await getDocs(q);
  // const users = userSnapshot.docs.map((doc) => {
  //   console.log(doc.data());
  //   doc.data()
  // });

  const user = userSnapshot.docs[0];


  return user;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
 // console.log('data', data)
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}