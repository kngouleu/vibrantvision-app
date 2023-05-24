import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostContent from '../../components/PostContent';
import { fetchPostBySlug } from '@/firebase/firebaseActions';
import { Post } from '@/types/types';

const PostPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (slug) {
          const fetchedPost: Post = await fetchPostBySlug(slug.toString());
          setPost(fetchedPost);
          
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [slug]);

  
  return (
    <>
      <Header />
      <div>
        {post && <PostContent post={post} />}
      </div>
      <Footer />
    </>
  );
};

export default PostPage;
