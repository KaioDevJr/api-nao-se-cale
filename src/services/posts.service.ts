import { db, admin } from './firebase';
import { Post, CreatePost, UpdatePost } from '../schemas/posts.schema';
import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

const postsCollection = db.collection('sectionPostsDestaque');

const toPosts = (doc: DocumentSnapshot<DocumentData>): Post => {  
  const data = doc.data();
  if (!data) {      
    throw new Error(`Document data is empty for doc ${doc.id}`);
  }
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    author: data.author,
    imageUrl: data.imageUrl,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

export const getPosts = async (): Promise<Post[]> => {
  const snapshot = await postsCollection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(toPosts);
};

export const getPostById = async (id: string): Promise<Post | null> => {
  const docRef = postsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null; 
  }
  
  return toPosts(doc);
};

export const createPost = async (data: CreatePost): Promise<Post> => {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const newPostData = {
    ...data,        
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await postsCollection.add(newPostData); 
  const newDoc = await docRef.get();

    return toPosts(newDoc);
};

export const updatePost = async (id: string, data: UpdatePost): Promise<Post | null> => {
  const docRef = postsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null; 
  await docRef.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const updatedDoc = await docRef.get();
  
  return toPosts(updatedDoc);
};

export const deletePost = async (id: string): Promise<boolean> => {
  const docRef = postsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();

  return true;
};