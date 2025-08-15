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

// --- Reports Service ---

/**
 * Lista as denúncias com paginação.
 * @param options - Opções de limite e cursor de paginação.
 * @returns Um objeto com a lista de itens e o ID do último item para a próxima página.
 */
export async function listReports(options: { limit: number; after?: string; }) {
    const { limit, after } = options;
    let q = db.collection("reports").orderBy("createdAt", "desc").limit(limit);

    if (after) {
        const afterDoc = await db.collection("reports").doc(after).get();
        if (!afterDoc.exists) {
            throw new Error("Pagination document not found.");
        }
        q = q.startAfter(afterDoc);
    }

    const qs = await q.get();
    const items = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
    const lastId = qs.docs.at(-1)?.id ?? null;

    return { items, lastId };
}

/**
 * Busca uma denúncia específica pelo ID.
 * @param id - O ID da denúncia.
 * @returns Os dados da denúncia ou `null` se não for encontrada.
 */
export async function getReportById(id: string) {
    const snap = await db.collection("reports").doc(id).get();
    if (!snap.exists) {
        return null;
    }
    return { id: snap.id, ...snap.data() };
}

/**
 * Atualiza o status e/ou notas de uma denúncia.
 * @param id - O ID da denúncia a ser atualizada.
 * @param payload - Os dados a serem atualizados (status e/ou notes).
 * @returns Os dados atualizados da denúncia ou `null` se não for encontrada.
 */
export async function updateReport(id: string, payload: { status?: string; notes?: string; }) {
    const { status, notes } = payload;
    const docRef = db.collection("reports").doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
        return null; // Denúncia não encontrada
    }

    const updateData: { [key: string]: any } = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (status) {
        updateData.status = status;
    }
    if (notes !== undefined) { // Permite que notes seja uma string vazia
        updateData.notes = notes;
    }

    await docRef.update(updateData);
    // Retorna os dados atualizados, buscando novamente para ter certeza
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}