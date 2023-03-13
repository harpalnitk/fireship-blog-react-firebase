import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase';
import { doc} from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

//Custom hook to read auth reacord and user profile doc
export function useUserData() {
  // get current user from firebase
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

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

      const [value,loading,error] = useDocument(
        doc(firestore,'users', user.uid));
      setUsername(JSON.stringify(value.data()))
    } else {
      setUsername(null);
    }
    //tells recat to unsubscribe when documen is no longer needed
   // return unsubscribe;
  }, [user]);

  return {user, username};
}
