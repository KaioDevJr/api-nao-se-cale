import { db, admin } from './firebase.js';
import { NaoSeCale, CreateNaoSeCale, UpdateNaoSeCale } from '../schemas/naoSeCale.schema';
import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

const naoSeCaleCollection = db.collection('sectionNaoSeCale');

/**
 * Função auxiliar para converter um documento do Firestore em um objeto NaoSeCale.
 * Ela garante que os dados retornados para a aplicação tenham o formato correto e seguro.
 * @param doc Um snapshot de um documento do Firestore.
 * @returns Um objeto do tipo NaoSeCale, com os campos tipados.
 */
const toNaoSeCale = (doc: DocumentSnapshot<DocumentData>): NaoSeCale => {
    const data = doc.data();
    if (!data) {
        throw new Error(`Document data is empty for doc ${doc.id}`);
    }
    
    // Handle documents that might not have createdAt/updatedAt timestamps
    const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();
    const updatedAt = data.updatedAt ? data.updatedAt.toDate() : new Date();
    
    // Ensure required fields exist
    if (!data.url || !data.conteudo) {
        throw new Error(`Document ${doc.id} is missing required fields: url or conteudo`);
    }
    
    return {
        id: doc.id,
        url: data.url,
        conteudo: data.conteudo,
        createdAt,
        updatedAt,
    };
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca todos os itens da seção NaoSeCale, ordenados pela data de criação.
 * @returns Uma Promise que resolve para um array de objetos NaoSeCale.
 */
export const getNaoSeCaleItems = async (): Promise<NaoSeCale[]> => {
    // Remove ordering by createdAt since some documents might not have this field
    const snapshot = await naoSeCaleCollection.get();
    return snapshot.docs.map(toNaoSeCale);
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca um item específico da seção NaoSeCale pelo seu ID.
 * @param id O ID do item a ser buscado.
 * @returns Uma Promise que resolve para o objeto NaoSeCale, ou `null` se o ID não for encontrado.
 */
export const getNaoSeCaleById = async (id: string): Promise<NaoSeCale | null> => {
    const docRef = naoSeCaleCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    return toNaoSeCale(doc);
};

/**
 * OPERAÇÃO CREATE (Criar)
 * Adiciona um novo item à seção NaoSeCale no banco de dados.
 * @param data Um objeto com os dados do novo item (url, conteudo), já validado pelo Zod no controller.
 * @returns Uma Promise que resolve para o objeto NaoSeCale completo e recém-criado, incluindo seu novo ID e timestamps.
 */
export const createNaoSeCale = async (data: CreateNaoSeCale): Promise<NaoSeCale> => {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const newNaoSeCaleData = {
        ...data,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await naoSeCaleCollection.add(newNaoSeCaleData);
    const newDoc = await docRef.get();
    return toNaoSeCale(newDoc);
};

/**
 * OPERAÇÃO UPDATE (Atualizar)
 * Modifica um item existente da seção NaoSeCale no banco de dados.
 * @param id O ID do item a ser atualizado.
 * @param data Um objeto com os campos que devem ser alterados.
 * @returns Uma Promise que resolve para o objeto NaoSeCale com os dados atualizados, ou `null` se o ID não for encontrado.
 */
export const updateNaoSeCale = async (id: string, data: UpdateNaoSeCale): Promise<NaoSeCale | null> => {
    const docRef = naoSeCaleCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    await docRef.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    const updatedDoc = await docRef.get();
    return toNaoSeCale(updatedDoc);
};

/**
 * OPERAÇÃO DELETE (Deletar)
 * Remove um item da seção NaoSeCale do banco de dados.
 * Verifica primeiro se o documento existe para fornecer um feedback mais preciso.
 * @param id O ID do item a ser deletado.
 * @returns Uma Promise que resolve para `true` se o item foi deletado, e `false` se não foi encontrado.
 */
export const deleteNaoSeCale = async (id: string): Promise<boolean> => {
    const docRef = naoSeCaleCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return false;

    await docRef.delete();
    return true;
};
