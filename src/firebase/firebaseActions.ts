// firebase/firebaseActions.ts
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where, getDoc } from 'firebase/firestore';
import { db, storage } from './firebaseConfig'; // ensure this points to your Firebase config file
import { Post } from '@/types/types';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';



// Fetch posts from Firestore
export const fetchPosts = async (): Promise<Post[]> => {
  const postCollection = collection(db, 'posts');
  const postSnapshot = await getDocs(postCollection);
  return postSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Post));
};


export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  try {
    const postCollection = collection(db, 'posts');
    const querySnapshot = await getDocs(query(postCollection, where('slug', '==', slug)));

    if (!querySnapshot.empty) {
      const postDoc = querySnapshot.docs[0];
      const postData = { uid: postDoc.id, ...postDoc.data() } as Post;
      return postData;
    } else {
      throw new Error(`Post with slug ${slug} does not exist.`);
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};





// Fetch user's posts from Firestore
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const userPostCollection = collection(db, 'posts');
  const userPostQuery = query(userPostCollection, where('uid', '==', userId));
  const userPostSnapshot = await getDocs(userPostQuery);
  return userPostSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Post));
};


// Add a new post to Firestore
// export const addNewPost = async (post: Post) => {
//   // Get a reference to the Firestore collection
//   const postCollection = collection(db, 'posts');
//   // Add the new post to the Firestore collection
//   await addDoc(postCollection, post);
// };

export const addNewPost = async (postData: Post, images: FileList | null, video: File | null)  => {
  try {
    const postCollection = collection(db, 'posts');

    if (images) {
      const imagesUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const imageId = uuidv4(); // Generate a unique ID for the image
        const imageRef = ref(storage, `images/${imageId}`);
        const uploadTask =  uploadBytesResumable(imageRef, images[i]);
        const snapshot = await uploadTask;
        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        imagesUrls.push(imageUrl);
      }
      postData.images = imagesUrls;
    }

    if (video) {
      const videoRef = ref(storage, `videos/${video.name}`);
      const uploadTask = uploadBytesResumable(videoRef, video);
      const snapshot = await uploadTask;
      postData.video = await getDownloadURL(uploadTask.snapshot.ref);
    }

    const newPostRef = await addDoc(postCollection, postData);
    const newPostId = newPostRef.id;
    postData.slug = newPostId;
    await updateDoc(newPostRef, { slug: newPostId });

  } catch (error) {
    console.error('Error adding new post:', error);
    throw error;
  }
};

// Delete a post from Firestore
export const deletePost = async (postSlug: string) => {
  const postRef = doc(db, 'posts', postSlug);
  await deleteDoc(postRef);
};

// Update a post in Firestore
export const updatePost = async (postId: string, updatedPost: Post) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, updatedPost);
};

