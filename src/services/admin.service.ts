import { admin, db, bucket } from './firebase.js';

// --- Banners Service ---

/**
 * Lista todos os banners ordenados por data de criação.
 */
export async function listBanners() {
    const qs = await db.collection("banners").orderBy("createdAt", "desc").get();
    return qs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Confirma a criação de um banner, tornando o arquivo público e salvando no Firestore.
 * @param payload - Dados do banner a ser criado.
 * @returns O ID e a URL pública do novo banner.
 */
export async function confirmBanner(payload: { storagePath: string; alt?: string; link?: string; isActive?: boolean; }) {
    const { storagePath, alt = "", link = "", isActive = true } = payload;
    const file = bucket.file(storagePath);

    await file.makePublic();
    const [meta] = await file.getMetadata();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    const docRef = await db.collection("banners").add({
        storagePath,
        alt,
        link,
        contentType: meta.contentType || null,
        url: publicUrl,
        isActive,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { id: docRef.id, url: publicUrl };
}

/**
 * Deleta um banner e seu arquivo associado no Storage.
 * @param id - O ID do banner a ser deletado.
 * @returns `true` se bem-sucedido, `null` se o banner não for encontrado.
 */
export async function deleteBanner(id: string) {
    const docRef = db.collection("banners").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
        return null;
    }

    const data = snap.data() as { storagePath?: string } | undefined;
    if (data?.storagePath) {
        await bucket.file(data.storagePath).delete({ ignoreNotFound: true });
    }

    await docRef.delete();
    return true;
}