import '@/../styles/globals.css';
import Navbar from '../components/Navbar';
import {Toaster} from 'react-hot-toast';
import {UserContext} from '../lib/context';

import {useUserData} from '../lib/hooks';


//import {GetServerSideProps} from 'next/app';

// _app.js file special file of next serves as entry
// point for any page in application.it's a wrapper
// that surronds any other page

// we may use it to add UI components which are availbale on every 
//page like Navbar,Footer OR
// use it to manage authentication state in the front end

export default function App({ Component, pageProps }) {
const userData= useUserData();
console.log('userData in app', userData)


  return (
  <>
  <UserContext.Provider value={userData}>
      <Navbar/>
  {/* nextjs already there code  */}
   <Component {...pageProps} />

    {/* react-hot-toast package custom installed  */}
    <Toaster/>
    </UserContext.Provider>
  </>
 
  
  
  );
}
