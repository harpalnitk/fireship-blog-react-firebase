import Link from 'next/link';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
//Top Navbar

export default function Navbar(){
    //any component that uses these values will re-render
    //if user or username changes
    const { user, username } = useContext(UserContext);
    const router = useRouter();

    const signOutUser =  async () => {
        const result = await signOut(auth);
        router.reload();
      }

    return(
        <nav className='navbar'>
           <ul>
            <li>
                <Link href='/'>
                    <button className='btn-logo'>FEED</button>
                </Link>
            </li>

            {/* user is signed in and has username  */}
            {username && (
                <>
            <li className="push-left">
              <button onClick={signOutUser}>Sign Out</button>
            </li>
                 <li className='push-left'>
                 <Link href='/admin'>
                    <button className='btn-blue'>Write Posts</button>
                 </Link>
                 </li>
                 <li>
                 <Link href={`/${username}`}>
                    <img src={user?.photoURL || '/hacker.png'}/>
                 </Link>
                    </li>

                </>
            )}


            {/* user is not signed in OR has not created username  */}
            {!username && (
            <li>
                <Link href='/enter'>
                    <button className='btn-blue'>Log In</button>
                </Link>
            </li>
            )}
            
            </ul> 
        </nav>
    );
}