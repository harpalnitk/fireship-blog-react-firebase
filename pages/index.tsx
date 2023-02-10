import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import Link from 'next/link';
import Loader from '../components/Loader';

import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import { useState } from 'react';


//Max posts to query per page

const LIMIT= 1;
//function for SSR
export async function getServerSideProps(context){
const postsQuery = firestore
//collection group query ; queries any posts 
//collection no matter where it is nested
.collectionGroup('posts')
.where('published', '==', true)
.orderBy('createdAt', 'desc')
.limit(LIMIT);
const posts = (await postsQuery.get()).docs.map(postToJSON);

return {
  props: { posts }, // will be passed to the page component as props
};


}


export default function Home() {
  return (
    <main>
      {/* <Link href={{
        pathname:'/[username]',
        query:{username:'jeffd23'}
       
      }}>
         Jeff's Profile
      </Link>

      <Loader show/> */}

      {/* FOR HOMEPAGE WE WILL SHOW FIRST 10 POSTS WITH LOAD MORE BUTON  */}
    </main>
  )
}
