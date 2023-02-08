import '@/styles/globals.css';

//import {GetServerSideProps} from 'next/app';

// _app.js file special file of next serves as entry point for any page in application.it's a wrapper that surronds any other page

// we na use it to add UI components which are availbale on every page like Navbar,Footer OR
// use it to manage authentication state in the front end

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
