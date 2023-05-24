import '../css/globals.css';
import { Inter } from 'next/font/google';
import React, { Fragment, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { getUserPosts } from '@/firebase/firebaseActions';
import { auth } from '@/firebase/firebaseConfig';
import { User } from '@/types/types';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = useState<User | null>(null); // Use the User type for the user state
  const [isLoading, setIsLoading] = useState(true); // Track if user data is being loaded

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User is signed in
        const userPosts = await getUserPosts(userAuth.uid);
        setUser({
          ...(userAuth as User), // Cast userAuth to the User type
          posts: userPosts,
        });
      } else {
        // User is signed out
        setUser(null);
      }

      setIsLoading(false); // User data has finished loading
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    // Show loading state while user data is being loaded
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <Component {...pageProps} user={user} />
    </Fragment>
  );
};

export default MyApp;
