
import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

//no server side fetching for admin pages
//as these pages will be used only by authenticated users
export default function AdminPostsPage(props){
    return (
        <main>
          <AuthCheck>
            <PostList />
            <CreateNewPost />
          </AuthCheck>
        </main>
      );
}

function PostList() {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
    const query = ref.orderBy('createdAt');
    //read collection in realtime using react hooks
    const [querySnapshot] = useCollection(query);
  //useCollectionData hook is also there which gives document directly
  //but useCollection hook is needed when we need to update/delete data
    const posts = querySnapshot?.docs.map((doc) => doc.data());
  
    return (
      <>
        <h1>Manage your Posts</h1>
        <PostFeed posts={posts} admin />
      </>
    );
  }

  function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');
  
    // Ensure slug is URL safe
    //encodeURI function is built into the browser
    //and allows us to format the string in URL safe format
    const slug = encodeURI(kebabCase(title));
  
    // Validate length
    const isValid = title.length > 3 && title.length < 100;
  
    // Create a new post in firestore
    const createPost = async (e) => {
      e.preventDefault();
      const uid = auth.currentUser.uid;
      //we don't want doc id to be generated by firestore
      //therefore we will make a reference to document which does not exists yet
      //with value of slug as id
      const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);
  
      // Tip: give all fields a default value here
      const data = {
        title,
        slug,
        uid,
        username,
        published: false,
        content: '# hello world!',
        //using server timestamp from firestore
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        heartCount: 0,
      };
  
      await ref.set(data);
  
      toast.success('Post created!');
  
      // Imperative navigation after doc is set
      router.push(`/admin/${slug}`);
    };
  
    return (
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
          className={styles.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </form>
    );
  }