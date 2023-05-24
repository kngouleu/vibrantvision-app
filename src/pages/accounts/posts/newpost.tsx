import { ChangeEvent, FormEvent, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { addNewPost } from '@/firebase/firebaseActions';
import { serverTimestamp } from 'firebase/firestore';
import { uploadmedia } from '@/utils/storage';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/router';



const NewPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [citation, setCitation] = useState('');
  const user = auth.currentUser;
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);





  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (title.length > (50)) {
      alert('Title must be at most 50 characters');
      return;
    }
    if (title.length < 1) {
      alert('Title must be at least 1 character');
      return;
    }
    

    if (citation.length > 300) {
      alert('Citation must be at most 300 characters');
      return;
    }

    if (description.length > 1000) {
      alert('Description must be at most 1000 characters');
      return;
    }

    const imagesUrls: string[] = [];
    let videoUrl: string  = '';

    const postData = {
        author: user?.displayName || '',
        uid: user?.uid || '',
        title: title,
        description: description,
        images: imagesUrls,
        video: videoUrl,
        dateCreated: new Date(),
        slug: '',
    };

    setIsPosting(true); 

    try {
      // Create the postData object...
  
      await addNewPost(postData, images, video);
      router.push('/accounts/profile');
    } catch (error) {
      console.error('Error adding new post:', error);
      // Handle the error...
    } finally {
      setIsPosting(false); // Enable the button after post creation (success or failure)
    }

  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length <= 50) {
      setTitle(value);
    }
  };

  const handleCitationChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 300) {
      setCitation(value);
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 1000) {
      setDescription(value);
    }
  };


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setImages(e.target.files);
    }  
};

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setVideo(e.target.files[0]);
    } 
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center pt-6 sm:pt-0 bg-gray-100">
        <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <h1 className="text-2xl font-bold mb-4">New Post</h1>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <input 
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" 
              type="text" 
              placeholder="Title" 
              value={title} 
              onChange={handleTitleChange}
              />
            <textarea 
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" 
              placeholder="Citation" 
              value={citation} 
              onChange={handleCitationChange} 
            />
            <textarea 
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" 
              placeholder="Description" 
              value={description} 
              onChange={handleDescriptionChange} 

            />
            <div>
              <label className="text-gray-700">Upload Images:</label>
              <input 
                className="mt-2"
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
              />
            </div>
            <div>
              <label className="text-gray-700">Upload Video:</label>
              <input 
                className="mt-2"
                type="file" 
                accept="video/*" 
                onChange={handleVideoUpload} 
              />
            </div>
            <button
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="submit"
              disabled={isPosting} // Disable the button if isPosting is true
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewPost;
