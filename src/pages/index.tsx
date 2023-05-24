// pages/index.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostListItem from '../components/PostListItem';
import { fetchPosts } from '@/firebase/firebaseActions';
import { Post } from '@/types/types';


const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  
  useEffect(() => {
    const getPosts = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };
  
    getPosts();
  }, []);


  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleSortBy = (sortOption: string) => {
    setSortBy(sortOption);
  };


  useEffect(() => {
    const sortPosts = () => {
      let sortedPosts = [...posts];

      // Sort posts based on selected sort option
      switch (sortBy) {
        case 'latest':
          sortedPosts.sort((a, b) => b.dateCreated.valueOf() - a.dateCreated.valueOf());
          break;
        case 'oldest':
          sortedPosts.sort((a, b) => a.dateCreated.valueOf() - b.dateCreated.valueOf());
          break;
        case 'az':
          sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'za':
          sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }



      setPosts(sortedPosts);
    };

    sortPosts();
  }, [sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-[#ececec]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
      <div className="text-center mb-8 h-60 flex flex-col justify-center bg-gradient-to-r from-blue-500 to-indigo-500" style={{ background: '#2b5c94' }}>
        <h1 className="text-5xl font-bold mb-4 text-white">
          <span className="px-6 py-3 inline-block rounded-md shadow-lg hover:transform hover:translate-y-1 transition-transform duration-300">
            Inspiring Creativity, Empowering Vision
          </span>
        </h1>
        <p className="text-xl text-white">
          Embark on a Journey of Imagination and Exploration, where Limitless Creativity and Empowering Visions come to Life.
        </p>
      </div>



        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Latest Posts</h2>
          <div className="mb-4">
            <label className="mr-2 font-bold">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortBy(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              <option value="latest">Latest to Oldest</option>
              <option value="oldest">Oldest to Latest</option>
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, showMore ? posts.length : 9).map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </div>
          {posts.length > 9 && (
            <button
              onClick={handleShowMore}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              {showMore ? 'Show Less' : 'Load More'}
            </button>
          )}
        </section>



        {isLoading && <div>Loading...</div>}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;