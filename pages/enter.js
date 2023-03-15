import { auth,firestore} from '../lib/firebase';
import { useContext, useState, useEffect, useCallback} from 'react';
import { UserContext } from '../lib/context';
import Metatags from '../components/Metatags';

import { GoogleAuthProvider,signInWithPopup,signOut,signInAnonymously  } from 'firebase/auth';

//custom library installed by us
import debounce from 'lodash.debounce';

export default function EnterPage({}) {
    //any component that uses these values will re-render
    //if user or username changes
    const { user, username } = useContext(UserContext);
    console.log('user',user);
    console.log('username',username);

  // 3(Three) States in which user auth can be

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
       <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );
}

//  Sign In WIth Google button
function SignInButton() {
    //try catch should be used here
    const signInWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
        //await auth.signInWithPopup(googleAuthProvider);
      const result = await signInWithPopup(auth, provider);
      };
      



      return (
        <>
          <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} width="30px" /> Sign in with Google
          </button>
          <button onClick={async () => await signInAnonymously(auth)}>
            Sign in Anonymously
          </button>
        </>
      );
}

function SignOutButton() {
  const signOutUser = async () => {
    const result = await signOut(auth);
 }
    //removes jsonwebtoken from the browser
    return <button onClick={signOutUser}>Sign Out</button>;
}

function UsernameForm() {
//FEATURE of app: USER CAN HAVE CUSTOM USERNAME
//feature requires two collections users(firebase uid: displayName,photoURL,username)
//and usernames(username: firbase uid) collection
//this is called reverse mapping and it allows us to validate 
//uniqueness of usernames

//form has 3 states
const [formValue, setFormValue] = useState('');
const [isValid, setIsValid] = useState(false);
const [loading, setLoading] = useState(false);

//grab user and username from global context
const { user, username } = useContext(UserContext);


//need to be wrapped in try-catch
const onSubmit = async (e) => {
  e.preventDefault();

  // Create refs for both documents
  const userDoc = firestore.doc(`users/${user.uid}`);
  const usernameDoc = firestore.doc(`usernames/${formValue}`);

  // Commit both docs together as a batch write.
  //fail or succeed together
  const batch = firestore.batch();
  batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
  batch.set(usernameDoc, { uid: user.uid });

  await batch.commit();
};


// On input change Handler
const onChange = (e) => {
  // Force form value typed in form to match correct format
  const val = e.target.value.toLowerCase();
  const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  // Only set form value if length is < 3 OR it passes regex
  if (val.length < 3) {
    setFormValue(val);
    setLoading(false);
    setIsValid(false);
  }

  if (re.test(val)) {
    setFormValue(val);
    //asynchronously checking for username in database
    setLoading(true);
    setIsValid(false);
  }
};

//Listens to form value any time it changes
useEffect(() => {
  checkUsername(formValue);
}, [formValue]);

// Hit the database for username match after each debounced change
// useCallback is required for debounce to work

//anytime react re-renders it creates a new functional object
//which will not be debounced, useCallBack allows that function to be memoized
//so that it can easily be debounced between state changes
const checkUsername = useCallback(

  //will stop the execution of inner function for 500ms delay
  debounce(async (username) => {
    if (username.length >= 3) {
      const ref = firestore.doc(`usernames/${username}`);
      const { exists } = await ref.get();
      console.log('Firestore read executed!');
      setIsValid(!exists);
      setLoading(false);
    }
  }, 500),
  []
);


return (
  !username && (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        {/* we want to bind input to formValue State in the component
        this technique is called controlled Input */}
        <input name="username" placeholder="username" value={formValue} onChange={onChange} />
        <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>

        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </form>
    </section>
  )
);
}

//error message for different states of form
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
