import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUserPosts } from '@/firebase/firebaseActions';
import { auth } from '@/firebase/firebaseConfig';
import { Post } from '@/types/types';
import PostListItem from '@/components/PostListItem';

const Profile = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  useEffect(() => {
    const fetchPosts = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const fetchedPosts = await getUserPosts(user.uid);
          setPosts(fetchedPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      setLoading(false); // Move this statement outside the try-catch block
    };
  
    fetchPosts();
  }, []);
  

  const handleDeletePost = (postId: string) => {
    // Logic to delete the post
    console.log('Delete post:', postId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex-grow p-4">

        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Add New Blog Post</h2>
          <button
            className="bg-[#233142] text-white py-2 px-4 rounded hover:underline"
            onClick={() => handleNavigation('/accounts/posts/newpost')}
          >
            Create New Post
          </button>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Settings</h2>
          <Link
            href="/accounts/settings"
            className="bg-[#233142] text-white py-2 px-4 rounded hover:underline"
          >
            Go to Settings
          </Link>
        </section>
      </div>
      <div className="flex-grow flex items-center justify-center pt-6 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-screen-xl w-full px-6 py-4 mx-auto sm:px-4">
          <h1 className="text-2xl font-bold mb-4 col-span-full">Your Posts</h1>
          {loading ? (
            <p>Loading...</p> // Show loading state
          ) : posts.length > 0 ? (
            posts.map((post) => <PostListItem key={post.slug} 
            post={post}
            
            />)
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
