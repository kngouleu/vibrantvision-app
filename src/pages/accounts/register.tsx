import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../firebase/firebaseConfig'
import { createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase, updateProfile } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import error from 'next/error';
import { getFirestore, collection, getDocs, query, where, addDoc } from 'firebase/firestore';


const RegisterPage = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  

  const isStrongPassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const isUsernameTaken = async (username : string) => {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };
  
  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (username.length < 2) {
      setError('Use 2 characters or more for your name');
      return;
    }
  
    if (await isUsernameTaken(username)) {
      setError('This username is already taken.');
      return;
    }

    if (password.length < 8) {
      setError('Use 8 characters or more for your password');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Please choose a stronger password. Try a mix of letters, numbers, and symbols.');
      return;
    }

    setError(''); // Reset the error message if the password is valid

    try {
      const { user } = await createUserWithEmailAndPasswordFirebase(auth, email, password);
      

      await addDoc(collection(db, 'users'), {
        username,
        uid: user.uid,
      });
      await updateProfile(user,{
        displayName: username,
      })
      
      router.push('/');
    } catch (error) {
      setError('Registration issue');
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#ececec]">
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <input className="w-full border border-gray-300 p-2 rounded" type="text" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
          <input className="w-full border border-gray-300 p-2 rounded" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border border-gray-300 p-2 rounded" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-500">{error}</p>}
          <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleSignUp}>Register</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
