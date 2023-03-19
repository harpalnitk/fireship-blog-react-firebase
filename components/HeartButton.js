// a heart, like, clap creates many to many relationship
// where a user can have many posts through hearts
//we will use sub-collection of hearts under posts and store as doc Id 
//the ids of users who have hearted the post
//this allows us to
//1. query if user has already hearted post
//2. get list of all users who have heareted post
//3. get all posts which user has hearted

import { firestore, auth } from '../lib/firebase';
 import { useDocument } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import { 
  getDoc,
  doc,
  writeBatch,
  increment
  } from "firebase/firestore";

// Allows user to heart or like a post
export default function Heart({ postRef }) {
  const [heart,setHeart] = useState(false);
  // Listen to heart document for currently logged in user
  //const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid);
  const heartRef = doc(postRef,'hearts',auth.currentUser.uid);

  //console.log('auth.currentUser.uid',auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  // console.log('heartDoc', heartDoc);
  // console.log('heartDoc exists', heartDoc?.exists());
 
//   let heartSnap;
//   const getHeartSnap = async ()=>{
//     heartSnap = await getDoc(heartRef);
//    // console.log('heartSnap', heartSnap);
//    setHeart(heartSnap?.exists());
//  }
//   useEffect(()=>{


//     getHeartSnap();
   
//   },[postRef]);
  
 

  // Create a user-to-post relationship
  const addHeart = async () => {
try {
      const uid = auth.currentUser.uid;
      //const batch = firestore.batch();
      const batch = writeBatch(firestore);
      batch.update(postRef, { heartCount: increment(1) });
      batch.set(heartRef, { uid });
      await batch.commit();
      //getHeartSnap();
} catch (error) {
  console.log(error);
}
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    //const batch = firestore.batch();
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
    //getHeartSnap();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}