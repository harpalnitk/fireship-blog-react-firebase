import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import Metatags from '../../components/Metatags';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { firestore } from '../../lib/firebase';
import { 
    collection,
    query,
    orderBy,
    limit,
    where,
    getDocs,
 } from "firebase/firestore";
// static routes have poriority over dynamic routes 

// SSR is good strategy for this page
//as it is a public page and will be generated on server
//fresh for each new request

//async function for SSR
export async function getServerSideProps({query: queryParam}){

    const {username} = queryParam;
    const userDoc = await getUserWithUsername(username);
    // if username does not exists on server
 // If no user, short circuit to 404 page
 if (!userDoc) {
    return {
        //this tells next to render 404 page
        //next has default 404 page but it can be customized
        //be creating 404.js file in route of pages directory
      notFound: true,
    };
  }
    //JSON serializable data
    let user = null;
    let posts = null;
if(userDoc){
    user = userDoc.data();
    

   //console.log('user', userDoc.id);
    // const postsQuery = userDoc.ref
    // .collection('posts')
    // .where('published','==',true)
    // .orderBy('createdAt', 'desc')
    // .limit(5);

    const postsRef =  collection(firestore,'users',userDoc.id,'posts');
    const q =  query(postsRef, where('published', '==', true), orderBy("createdAt",'desc'), limit(5))
    const postsSnapshot = await getDocs(q);


//postToJSON needed because post has firestore timestamp 
//and we need to convert it to number
    // posts = (await postsQuery.get()).docs.map(postToJSON)
    posts = postsSnapshot.docs.map(postToJSON)
    //console.log('posts',posts);
}

    return{
        props:{user,posts}, // will be passed to page component as props
          }
}



export default function UserProfilePage({user,posts}){
    return(
        <main>
            <Metatags title={user.username} description={`${user.username}'s public profile`} />
           <UserProfile user={user}/>
           <PostFeed posts={posts}/>
        </main>
    );
}