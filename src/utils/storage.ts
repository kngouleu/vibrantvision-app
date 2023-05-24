import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from "firebase/app";
import { storage } from "@/firebase/firebaseConfig";

export const uploadmedia = async (imageFile: File) => {
  const storageRef = ref(storage, 'images/' + imageFile.name);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        // You can observe state change here if required
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      }, 
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
