import { admin, db } from './firebase.js';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
const publicContent = db.collection('publicContent');
const banners = db.collection('banners');
const reports = db.collection('reports');

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

interface Attachment {
    storagePath: string;
    filename: string;
}

export async function createReport(payload: {
    descricao: string;
    contato?: string | null;
    anonimo?: boolean;
    attachments?: Attachment[];
}) {
    const code = `NSC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1e6)).padStart(6, '0')}`;
    const docData = {
        protocol: code,
        descricao: payload.descricao,
        contato: payload.contato ?? null,
        anonimo: !!payload.anonimo,
        attachments: payload.attachments ?? [],
        status: 'new',
        channel: 'site',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = await reports.add(docData);
    return { id: ref.id, protocol: code };
}
