> npx create-react-app fireship-blog-react-firebase
do not select eslint, typescript, src folder and app folder

## CSS
1. globals.css is the file where u can define global styles applicable to entire app
2. create css modules for component specific css and then import them into the js files
3. during build time imported css classes are given random names so we dont have to worry about name collissions

## PAGES directory
defines the routing of the application
# root url maps to index.js file in the pages folder
each page file will have one default export

# _app.js file special file of next serves as entry point for any page in application.it's a wrapper that surronds any other page

we may use it to add UI components which are availbale on every page like Navbar,Footer OR
use it to manage authentication state in the front end

## we will add two new folders
1. components: for reusable components
2. lib: for reusable libraries

## add typescript
create tsconfig.json file in root folder
next will automatically install all dependencies and create next-env.d.ts file. this file helps IDE the corresponding types

rename component files to .tsx and regular js files to  .ts

## Install firebase
>npm i firebase@8.2.1 react-firebase-hooks@2.2.0 --force
React-firebase-hooks
 connector between react and firebase

 # reactfire is official library of react team and uses suspends and can be bit complex


 ### Install firebase-ttols globally

 >npm install firebase-tools -g

 ### Install React Developer Tools in chrome


 ## react-hot-toast package for custom-toast messages

 ### SSR in next
 if page is static and does not have blocking data
 next will automatically generate it for SSR

 if pages depend on external data sources; next has two options
 1. SSR
 export async function getServerSideProps(){
    //Fetch Data here

    return {
        props: {data}
    }
 }

 Thus, fresh data on every request which prevents caching and slower performance for the user

 2. SSG: Static Generation
 export async function getStaticProps(){
    //Fetch Data here

    return {
        props: {data}
    }
 }

 it tells next to fetch data at build time and is good for caching
 but problem is data can be stale; if data changes we need to re-deploy the 
 page or the entire site

 3. ISR: Incremental Static Regeneration

 export async function getStaticProps(){
    //Fetch Data here

    return {
        props: {data},
        revalidate: 100
    }
 }