import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

export const fetchData = async (collectionPath: string): Promise<any[]> => {
  try {
    const dataCollection = collection(db, collectionPath);
    const dataSnapshot = await getDocs(dataCollection);
    return dataSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};