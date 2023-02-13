//this component will render a markdown screen to html
//and to help us do that 
// Install >npm i react-markdown


import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }) {

    // if date is in number format convert to javascript date
    // and if in friestore timestamp format then convert directly to date
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <p className="text-info">@{post.username}</p>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      {/* post content stored in markdown format in friestore 
      will be converted to html by reactmarkdown for end user  */}
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}