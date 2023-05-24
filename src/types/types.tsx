// src/types/post.ts
import { User as FirebaseUser } from '@firebase/auth-types';


export type Post = {
    slug: string;
    author: string;
    uid: string;
    title: string;
    images: string[];
    video: string;
    dateCreated: Date;
    description: string;
  };
  
export interface User extends FirebaseUser {
  posts: Post[];
  photoURL: string;
  emailVerified: boolean;
  displayName: string | null;
  uid: string;
}

  