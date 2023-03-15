import Loader from '../components/Loader';
import Metatags from '../components/Metatags';

import { firestore, postToJSON } from '../lib/firebase';
import { useState } from 'react';
import PostFeed from '../components/PostFeed';

import { 
collectionGroup,
query,
orderBy,
limit,
where,
getDocs,
Timestamp,
startAfter  } from "firebase/firestore";
// import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';

//Max posts to query per page

const LIMIT = 1;
//function for SSR
export async function getServerSideProps(context) {
  // const postsQuery = firestore
    //collection group query ; queries any posts
    //collection no matter where it is nested
  //   .collectionGroup('posts')
  //   .where('published', '==', true)
  //   .orderBy('createdAt', 'desc')
  //   .limit(LIMIT);
  //console.log('firestore', firestore);
    const postsRef =  collectionGroup(firestore,'posts');
    const q =  query(postsRef, where('published', '==', true), orderBy("createdAt",'desc'), limit(LIMIT))
    const querySnapshot = await getDocs(q);
  //const posts = (await postsQuery.get()).docs.map(postToJSON);
  // const [postsSnapshot, loading,error] = useCollection(q);
  // console.log(error);
  // const posts = postsSnapshot.map(postToJSON)
  //  console.log('posts in server', postsSnapshot);
  let posts = [];
  //console.log(querySnapshot.docs.map(postToJSON));
  posts = querySnapshot.docs.map(postToJSON);

  //console.log(posts);


  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  //props rendered on server used as  initial value in the State
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    //get last post from current list
    const last = posts[posts.length - 1];

    //the created at timestamp might be a number
    //OR firestore timestamp depending upon whether
    //we fetched data on server or on client
    //It needs to be in firestore timestamp format
    const cursor =
      typeof last.createdAt === 'number'
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    // const query = firestore
    //   .collectionGroup('posts')
    //   .where('published', '==', true)
    //   .orderBy('createdAt', 'desc')
    //   .startAfter(cursor)
    //   .limit(LIMIT);

      const postsRef =  collectionGroup(firestore,'posts');
      const q =  query(postsRef, where('published', '==', true), orderBy("createdAt",'desc'),startAfter(cursor), limit(LIMIT))
      const querySnapshot = await getDocs(q);

    const newPosts = querySnapshot.docs.map((doc) => doc.data());
    console.log('posts in client', newPosts);
    //concat new posts to the existing posts
    setPosts(posts.concat(newPosts));
    setLoading(false);
    // if new post length is less than limit the  we know we
    //have reached the end of database
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title="Home Page" description="Get the latest posts on our site" />
      {/* <Link href={{
        pathname:'/[username]',
        query:{username:'jeffd23'}
       
      }}>
         Jeff's Profile
      </Link>

      <Loader show/> */}

      {/* FOR HOMEPAGE WE WILL SHOW FIRST 10 POSTS WITH LOAD MORE BUTON  */}
      <div className="card card-info">
        <h2>💡 Fireship Blog React Firebase</h2>
        <p>Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content created by other users.</p>
      </div>


      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
