import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Post } from '../types/types';
import { auth } from '@/firebase/firebaseConfig';
import { deletePost } from '@/firebase/firebaseActions';
import { useRouter } from 'next/router';

type Props = {
  post: Post;
  
};

const PostListItem: React.FC<Props> = ({ post }) => {

  const [showOptions, setShowOptions] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    if (
      blockRef.current &&
      !blockRef.current.contains(event.target as Node) &&
      !event.currentTarget.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };
  
  
  useEffect(() => {
    const closeOptions = (event: MouseEvent) => {
      if (blockRef.current && !blockRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', closeOptions);

    return () => {
      document.removeEventListener('mousedown', closeOptions);
    };
  }, []);

  const handleDeletePost = (slug: string) => {
    deletePost(slug);
    window.location.reload();
  }
  

  const renderMedia = () => {
    if (post.images.length > 0) {
      return (
        <div className="h-96 w-full relative" >
          <img className="h-full w-full object-cover" src={post.images[0]} alt={post.title} />
          <div className="absolute inset-0 flex flex-col items-center justify-end p-4 bg-black bg-opacity-50">
            <div className="text-white text-center uppercase tracking-wide text-sm font-semibold">
              {post.author}
            </div>
            <h2 className="text-white text-lg mt-1 leading-tight font-medium text-center truncate break-words whitespace-normal">
              {post.title}
            </h2>
          </div>
        </div>
      );
    } else if (post.video) {
      return (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-full"
            src={post.video}
            title={post.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    } else {
      return (
        <div className="h-96 w-full bg-[#96a9b3] flex flex-col items-center justify-center">
          <div className="text-indigo-500 font-semibold uppercase tracking-wide text-sm mb-2">
            {post.author}
          </div>
          <h2 className="text-lg leading-tight font-medium text-black text-center truncate break-words whitespace-normal">
            {post.title}
          </h2>
        </div>
      );
    }
  };
  const renderOptions = () => {
    if (showOptions && post.uid === auth.currentUser?.uid) {
      return (
        <div className="absolute top-2 right-2 z-10 flex flex-col bg-white p-2 rounded shadow" ref={blockRef}>
          <button className="text-gray-600 hover:text-gray-800 py-1 px-2" onClick={() => handleDeletePost(post.slug, )}>Delete Post</button>
        </div>
      );
    } else if (post.uid === auth.currentUser?.uid) {
      return (
        <div
          className="absolute top-2 right-2 z-10 bg-white"
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          <svg
            className="h-6 w-6 text-gray-600 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      );
    }
  };
  
  console.log(showOptions);
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="w-full max-w-md mx-auto bg-white rounded shadow-md overflow-hidden m-4 cursor-pointer relative"
      passHref
    >
      <div >
        {renderOptions()}
        {renderMedia()}
      </div>
    </Link>
  );
};

export default PostListItem;
