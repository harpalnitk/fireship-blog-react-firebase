//ISR : Incremental Static Regeneration
//The page is rendered in advance using
// a technique called static generation

//because the page is built in advance it can easily be cached
//on a CDN : most high performance option

// Disadvantage is that pre loaded data will not be changed if data
//in firestore changes

//Luckily nextjs has a feature called ISR allows us to rebuilt the 
//page on the server at a certain time interval

// Also, if a pre rendered page is not found next can fallback to SSR

// aslo, we will atke our server rendered content and hydrate it 
//with real time data from the firestore


import styles from '../../styles/Post.module.css';
import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';
import PostContent from '../../components/PostContent';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';

//Runs on SERVER for ISR
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
  
    let post;
    let path;
  
    if (userDoc) {
      const postRef = userDoc.ref.collection('posts').doc(slug);
      post = postToJSON(await postRef.get());
  
      //will help in hydration to real time data
      path = postRef.path;
    }
  
    return {
      props: { post, path },
      revalidate: 5000, //revalidate tells next to regenerate this 
      //page on server 
      //when new request comes in; but do son in certain time 
      //interval after every 5000s
    };
  }


  // To Tell next which paths(actual pages) to render in advance
  export async function getStaticPaths() {
    // Improve my using Admin SDK to select empty docs
    //more efficiant way is to use admin SDK
    const snapshot = await firestore.collectionGroup('posts').get();
  
    const paths = snapshot.docs.map((doc) => {
      const { slug, username } = doc.data();
      return {
        params: { username, slug },
      };
    });
  
    return {
      // must be in this format:
      // paths: [
      //   { params: { username, slug }}
      // ],
      paths,
      // how will next re-run this function each time we create a new post
      // for new posts it will give 404 error
      //however, adding fallback value of blocking
      // will tell next to go to regular SSR
      //once it renders the page then it can be cached on the CDN
      fallback: 'blocking',
    };
  }
  

export default function Post(props) {
//hydration should be used wisely
//as it will lead to two database reads, once during ISR
//and second during hydration

//Get postRef from props.path generated during ISR
const postRef = firestore.doc(props.path);
//use react hook to get a feed of data  in realTime 
//but if real time data has not been preloaded it will fallback to rendered 
//content on server
const [realtimePost] = useDocumentData(postRef);

//but if real time data has not been preloaded it will fallback to rendered 
//content on server
const post = realtimePost || props.post;
    return(
        <main className={styles.container}>
           <Metatags title={post.title} description={post.title} />
      
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }>
          <HeartButton postRef={postRef}/>
        </AuthCheck>



 
      </aside>

        </main>
    )
}