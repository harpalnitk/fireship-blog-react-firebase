import Metatags from '../../components/Metatags';
//since the form is complex we will use
//react-hook-form package
//this package allows us to treat a from like a reactive state
//in our component

import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import ImageUploader from '../../components/ImageUploader';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  deleteDoc,
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore";

export default function AdminPostsEdit({}){
    return (
        <AuthCheck>
          <PostManager />
        </AuthCheck>
      );
}

function PostManager() {

    //for preview mode and edit mode
    const [preview, setPreview] = useState(false);
  
    const router = useRouter();
    const { slug } = router.query;

  
    // const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const postRef = doc(firestore,'users',auth.currentUser.uid,'posts',slug);
    // to listen to post in real time
   // const [post] = useDocumentData(postRef);
   //but we don't need real time updates in this case
    const [post] = useDocumentDataOnce(postRef);
  
    return (
      <main className={styles.container}>
        {post && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>
  
              <PostForm postRef={postRef} defaultValues={post} preview={preview} />
            </section>
  
            <aside>
              <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
              <DeletePostButton postRef={postRef} />
            </aside>
          </>
        )}
      </main>
    );
  }
  
  function PostForm({ defaultValues, postRef, preview }) {
   
   //useForm hook provides a bunch 
   //of features to connect our html form to react
    const { register, handleSubmit, formState, reset, watch }
     = useForm({ defaultValues, mode: 'onChange' });
  
    const { errors, isValid, isDirty } = formState;
  
    const updatePost = async ({ content, published }) => {
        //no need to prevent default beahavior
        //as it is already handled by handleSubmit function of
        //form hook
      await updateDoc(postRef, {
        content,
        published,
        updatedAt: serverTimestamp(),
      });
  
      reset({ content, published });
  
      toast.success('Post updated successfully!');
    };
  
    return (
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
             {/* watch will watch the content field and re-render markdown component 
             every time content value changes  */}
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </div>
        )}
  
        <div className={preview ? styles.hidden : styles.controls}>
          <ImageUploader />
  
          <textarea
            // ref tells form hook to register this field and validate it 
            {...register("content",{
              maxLength: { value: 20000, message: 'content is too long' },
              minLength: { value: 10, message: 'content is too short' },
              required: { value: true, message: 'content is required' },
            })}
          ></textarea>
  
      {errors?.content && <p className="text-danger">{errors?.content?.message}</p>}
      {/* {errors?.content?.type === "minLength" && <p className="text-danger">minlength 10 and above</p>}
      {errors?.content?.type === "maxLength" && <p className="text-danger">maxLength 20000 allowed</p>} */}
          <fieldset>
            <input className={styles.checkbox} type="checkbox" {...register("published")} />
            <label>Published</label>
          </fieldset>
  
          <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
            Save Changes
          </button>
        </div>
      </form>
    );
  }
  
  function DeletePostButton({ postRef }) {
    const router = useRouter();
  
    const deletePost = async () => {
      const doIt = confirm('are you sure!');
      if (doIt) {
        await deleteDoc(postRef);
        router.push('/admin');
        toast('post annihilated ', { icon: '🗑️' });
      }
    };
  
    return (
      <button className="btn-red" onClick={deletePost}>
        Delete
      </button>
    );
  }