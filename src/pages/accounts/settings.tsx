import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { auth, storage } from '@/firebase/firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';



const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentProfilePicture(user.photoURL);
    }
  }, []);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
      setCurrentProfilePicture(URL.createObjectURL(e.target.files[0]));

    }
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;

    if (user) {
      // Re-authenticate the user
      const currentPassword = prompt('Please enter your current password');

      if (currentPassword && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        reauthenticateWithCredential(user, credential)
          .then(() => {
            // Delete the user account
            user
              .delete()
              .then(() => {
                console.log('Account deleted successfully');
                // Additional logic or redirect to a different page if needed
              })
              .catch((error) => {
                console.error('Error deleting account:', error);
                // Handle error scenarios
              });
          })
          .catch((error) => {
            console.error('Error re-authenticating user:', error);
            // Handle re-authentication error scenarios
          });
      } else {
        console.log('Current password not provided');
      }
    }
  };

  const handleChangeName = () => {
    
    const user = auth.currentUser;
    
    if (user) {
      // Update the user's display name
      
        updateProfile(user,{
          displayName: name,
          
        })
        .then(() => {
          console.log('Name changed successfully');
          // Add additional logic here if needed
        })
        .catch((error) => {
          console.error('Error changing name:', error);
          // Handle error scenarios
        });
    }
  };
  const handleChangeEmail = () => {
    const user = auth.currentUser;
  
    if (user) {
      const newEmail = email;
  
      if (newEmail) {
        if (user.email) {
          // Re-authenticate the user
          const currentPassword = prompt('Please enter your current password');
  
          if (currentPassword) {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
            reauthenticateWithCredential(user, credential)
              .then(() => {
                // Re-authentication successful, update the email
                updateEmail(user, newEmail)
                  .then(() => {
                    console.log('Email changed successfully');
                    // Add additional logic here if needed
                  })
                  .catch((error) => {
                    console.error('Error changing email:', error);
                    // Handle error scenarios
                  });
              })
              .catch((error: any) => {
                console.error('Error re-authenticating user:', error);
                // Handle re-authentication error scenarios
              });
          } else {
            console.log('Current password not provided');
          }
        } else {
          console.log('User email is null');
        }
      } else {
        console.log('New email not provided');
      }
    }
  };
  const handleChangePassword = () => {
    const user = auth.currentUser;
    if (user) {
      // Update the user's password
        updatePassword(user, password)
        .then(() => {
          console.log('Password changed successfully');
          // Add additional logic here if needed
        })
        .catch((error) => {
          console.error('Error changing password:', error);
          // Handle error scenarios
        });
    }
  };
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (user && profilePicture) {
      // Create a storage reference for the user's profile picture

      const storageRef = ref(storage, (`profilePictures/${user.uid}`));
      // const storageRef = storage.ref().child(`profilePictures/${user.uid}`);
  
      // Upload the profile picture file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);
      
  
      // Listen for upload completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading profile picture:', error);
          // Handle error scenarios
        },
        () => {
          // Get the download URL for the uploaded profile picture
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Update the user's profile picture URL
              updateProfile(user, {
                photoURL: downloadURL,
              })
              .then(() => {
                console.log('Profile picture changed successfully');
                // Add additional logic here if needed
              })
              .catch((error) => {
                console.error('Error changing profile picture:', error);
                // Handle error scenarios
              });
          });
        }
      );
    }
  
    // Reset the form fields
    setName('');
    setEmail('');
    setPassword('');
  };
  console.log(auth.currentUser?.displayName + 'hello')

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex-grow flex items-center justify-center pt-6 bg-gray-100">
        <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <label className="text-gray-700">Name:</label>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                  value={name}
                  onChange={handleNameChange}
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={handleChangeName}
                >
                  Change
                </button>
              </div>
            </div>
            {/* Email field */}
            <div>
              <label className="text-gray-700">Email:</label>
              <div className="flex items-center mt-1">
                <input
                  type="email"
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                  value={email}
                  onChange={handleEmailChange}
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={handleChangeEmail}
                >
                  Change
                </button>
              </div>
            </div>
            {/* Password field */}
            <div>
              <label className="text-gray-700">Password:</label>
              <div className="flex items-center mt-1">
                <input
                  type="password"
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={handleChangePassword}
                >
                  Change
                </button>
              </div>
            </div>
            {/* Profile picture field */}
            <div>
              <label className="text-gray-700">Profile Picture:</label>
              <div className="flex items-center mt-1">
                <div className="relative group">
                  {currentProfilePicture  ? (
                    <div className="w-16 h-16 rounded-full  overflow-hidden">
                      <img
                        src={currentProfilePicture }
                        alt="Profile"
                        className="w-full h-full object-cover "
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-neutral-700"></div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                    <span onClick={handleChooseFile} className="text-white text-sm font-medium" >
                      Change
                    </span>
                  </div>
                </div>
                <button className="ml-2 hover:text-blue-950"  onClick={handleChooseFile} >Change profile photo</button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    ref={fileInputRef}
                  />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              type="button"
              className="mt-4 px-3 py-1.5 border border-red-500 rounded-md text-sm font-medium text-red-500 bg-white hover:bg-red-50 focus:outline-none"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
