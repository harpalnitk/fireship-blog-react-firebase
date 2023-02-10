import { auth, firestore, googleAuthProvider } from '../lib/firebase';


export default function EnterPage({}) {
  const user = null;
  const username = null;

  // 3(Three) States in which user auth can be

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );
}

//  Sign In WIth Google button
function SignInButton() {
    //try catch should be used here
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
      };


      return (
        <>
          <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} width="30px" /> Sign in with Google
          </button>
          <button onClick={() => auth.signInAnonymously()}>
            Sign in Anonymously
          </button>
        </>
      );
}

function SignOutButton() {
    //removes jsonwebtoken from the browser
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {}
