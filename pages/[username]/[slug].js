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
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import Link from 'next/link';
//import { useDocumentData } from 'react-firebase-hooks/firestore';

import PostContent from '../../components/PostContent';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';
import { useState } from 'react';

import { 
  collectionGroup,
  getDocs,
  getDoc,
  doc
  } from "firebase/firestore";

//Runs on SERVER for ISR
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
  
    let post;
    let path;
  
    if (userDoc) {
      //const postRef = userDoc.ref.collection('posts').doc(slug);
      const postRef = doc(firestore,'users', userDoc.id,'posts',slug);
      //! above is working
      //const postRef = doc(userDoc.ref,'posts',slug);
     // post = postToJSON(await postRef.get());
        post = postToJSON(await getDoc(postRef));
      //will help in hydration to real time data
      path = postRef.path;
     // console.log('path getStaticProps', path);
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
    //const snapshot = await firestore.collectionGroup('posts').get();


    const postsRef =  collectionGroup(firestore,'posts');
    const postsSnapshot = await getDocs(postsRef);
  
    const paths = postsSnapshot.docs.map((doc) => {
      const { slug, username } = doc.data();
      return {
        params: { username, slug },
      };
    });

   // console.log('paths getStaticPaths',paths);
  
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
  

export default  function Post(props) {

  const [post,setPost] = useState(props.post);
//console.log('props.post',props.post)
//console.log('props.path',props.path)

//hydration should be used wisely
//as it will lead to two database reads, once during ISR
//and second during hydration

//Get postRef from props.path generated during ISR

// const postRef = firestore.doc(props.path);
 const postRef = doc(firestore,props.path);
//console.log('postRef',postRef);

//use react hook to get a feed of data  in realTime 
//but if real time data has not been preloaded it will fallback to rendered 
//content on server

//const [realtimePost] = useDocumentData(postRef);
const getPost = async () => {
  const realtimePostSnap = await getDoc(postRef);
  const realtimePost = realtimePostSnap.data(); 
  
  console.log('realtimePost', realtimePost);


//but if real time data has not been preloaded it will fallback to rendered 
//content on server
//setPost(realtimePost)
return  realtimePost ;

}

getPost();

console.log('post', post);

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
          {/* <HeartButton postRef={postRef}/> */}
        </AuthCheck>



 
      </aside>

        </main>
    )
}





// const batch = writeBatch(db)
// const postRef = doc(db, 'posts') // this fails, must pass and id
// const threadRef = doc(db, 'threads', post.threadId)
// batch.set(postRef, post)
// batch.update(threadRef,
//     'posts', arrayUnion(postRef.id),
//     'contributors', arrayUnion(state.authId))
// await batch.commit()