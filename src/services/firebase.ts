import admin from "firebase-admin";

if (!admin.apps.length) {
  // GOOGLE_APPLICATION_CREDENTIALS já aponta pro JSON no .env
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();

export { admin };