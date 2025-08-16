import { admin, db } from './firebase.js';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
const publicContent = db.collection('publicContent');
const banners = db.collection('banners');

export async function getActiveContent() {
    const snap = await publicContent.where('isActive', '==', true).orderBy('order').get();
    return snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() }));
}

export async function getActiveBanners() {
    const snap = await banners.where('isActive', '==', true).get();
    return snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() }));
}

export async function getContentById(docId: string) {
    const snap = await publicContent.doc(docId).get();
    if (!snap.exists) {
        return null;
    }
    return { id: snap.id, ...snap.data() };
}
