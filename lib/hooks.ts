import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase';
import { doc, getDoc} from 'firebase/firestore';
//import { useDocument } from 'react-firebase-hooks/firestore';

//Custom hook to read auth reacord and user profile doc
export  function  useUserData() {
  // get current user from firebase
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  //  console.log('user in hook', user);
  //  console.log('username in hook', username);

  //const [value,loading,error] = useDocument(doc(firestore,'users', user?.uid));
  //useEffect hook to listen to any changes in the user Object
  useEffect(() => {
    //turn off realtime subscription
    let unsubscribe;
    

    if (user) {
      //reference to firestore users collection
      
     // const ref = firestore.collection('users').doc(user.uid);
      // unsubscribe = ref.onSnapshot((doc) => {
      //   setUsername(doc.data()?.username);
      // });
      (async () => {
        const userRef = doc(firestore,'users', user?.uid);
        const userSnap = await getDoc(userRef);
        if(userSnap.exists){
          // console.log('userSnap.data()?.username',userSnap.data()?.username)

          setUsername(userSnap.data()?.username)
        }else{
          setUsername(null);
        }
       
      })();


    } else {
      setUsername(null);
    }
    //tells recat to unsubscribe when documen is no longer needed
   // return unsubscribe;
  }, [user]);

  return {user, username};
}
