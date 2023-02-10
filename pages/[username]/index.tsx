import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';

import { getUserWithUsername, postToJSON } from '../../lib/firebase';
// static routes have poriority over dynamic routes 

// SSR is good strategy for this page
//as it is a public page and will be generated on server
//fresh for each new request

//async function for SSR
export async function getServerSideProps({query}){

    const {username} = query;
    const userDoc = await getUserWithUsername(username);

    //JSON serializable data
    let user = null;
    let posts = null;
if(userDoc){
    user = userDoc.data();
    const postsQuery = userDoc.ref
    .collection('posts')
    .where('published','==',true)
    .orderBy('createdAt', 'desc')
    .limit(5);
//postToJSON needed because post has firestore timestamp 
//and we need to convert it to number
    posts = (await postsQuery.get()).docs.map(postToJSON)
}

    return{
        props:{user,posts}, // will be passed to page component as props
          }
}



export default function UserProfilePage({user,posts}){
    return(
        <main>
           <UserProfile user={user}/>
           <PostFeed posts={posts}/>
        </main>
    );
}