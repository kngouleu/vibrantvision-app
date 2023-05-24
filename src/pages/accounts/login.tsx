import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/firebaseConfig'
import { signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FirebaseError } from 'firebase/app';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');


  const signInWithEmailAndPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {

      await signInWithEmailAndPasswordFirebase(auth, email, password);
      router.push('/');
    } catch (error) {
      const firebaseError = error as FirebaseError; // We're casting error as FirebaseError
  
      if (firebaseError.code === 'auth/invalid-email') {
        console.log('Email issue')
        setError('The email address is badly formatted.');
      } else if (firebaseError.code === 'auth/wrong-password') {
        setError('Wrong password.');
        console.log('Password issue')
      } else if (firebaseError.code === 'auth/user-not-found') {
        setError('No user corresponding to the given email.');
      } else {
        setError('Failed to log in.');
      }
      console.log('Log in issue')
      // Remove this line:
      // setError('');
    }
  };
  

  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      console.log('Log in with Google issue')
    }
  };

  console.log(auth.currentUser?.displayName);

  return (
    <div className="flex flex-col min-h-screen bg-[#ececec]">
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input className="w-full border border-gray-300 p-2 rounded" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border border-gray-300 p-2 rounded" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={signInWithEmailAndPassword}>Sign In</button>
          <button className="w-full bg-red-500 text-white p-2 rounded" onClick={signInWithGoogle}>Sign In with Google</button>
          {error && <p className="text-red-500">{error}</p>}
          <p className="text-center">Don't have an account? <Link href="/accounts/register" className="text-blue-500 underline">Register</Link></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
