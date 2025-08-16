import { db, admin } from './firebase';
import { PorqueAderimos, CreatePorqueAderimos, UpdatePorqueAderimos } from '../schemas/porqueAderimos.schema';
import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

const porqueAderimosCollection = db.collection('sectionPorqueAderimos');

/**
 * Função auxiliar para converter um documento do Firestore em um objeto PorqueAderimos.
 * @param doc Um snapshot de um documento do Firestore.
 * @returns Um objeto do tipo PorqueAderimos, com os campos tipados.
 */
const toPorqueAderimos = (doc: DocumentSnapshot<DocumentData>): PorqueAderimos => {
    const data = doc.data();
    if (!data) {
        throw new Error(`Document data is empty for doc ${doc.id}`);
    }
    return {
        id: doc.id,
        conteudo: data.conteudo,
        titulo: data.titulo,
        url: data.url,
        createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
    };
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca todos os itens "Porque Aderimos", ordenados pela data de criação.
 * @returns Uma Promise que resolve para um array de objetos PorqueAderimos.
 */
export const getPorqueAderimos = async (): Promise<PorqueAderimos[]> => {
    const snapshot = await porqueAderimosCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(toPorqueAderimos);
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca um item "Porque Aderimos" específico pelo seu ID.
 * @param id O ID do item a ser buscado.
 * @returns Uma Promise que resolve para o objeto PorqueAderimos, ou `null` se o ID não for encontrado.
 */
export const getPorqueAderimosById = async (id: string): Promise<PorqueAderimos | null> => {
    const docRef = porqueAderimosCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    return toPorqueAderimos(doc);
};

/**
 * OPERAÇÃO CREATE (Criar)
 * Adiciona um novo item "Porque Aderimos" ao banco de dados.
 * @param data Um objeto com os dados do novo item, já validado pelo Zod no controller.
 * @returns Uma Promise que resolve para o objeto PorqueAderimos completo e recém-criado.
 */
export const createPorqueAderimos = async (data: CreatePorqueAderimos): Promise<PorqueAderimos> => {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const newPorqueAderimosData = {
        ...data,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await porqueAderimosCollection.add(newPorqueAderimosData);
    const newDoc = await docRef.get();
    return toPorqueAderimos(newDoc);
};

/**
 * OPERAÇÃO UPDATE (Atualizar)
 * Modifica um item "Porque Aderimos" existente no banco de dados.
 * @param id O ID do item a ser atualizado.
 * @param data Um objeto com os campos que devem ser alterados.
 * @returns Uma Promise que resolve para o objeto PorqueAderimos com os dados atualizados, ou `null` se o ID não for encontrado.
 */
export const updatePorqueAderimos = async (id: string, data: UpdatePorqueAderimos): Promise<PorqueAderimos | null> => {
    const docRef = porqueAderimosCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    await docRef.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    const updatedDoc = await docRef.get();
    return toPorqueAderimos(updatedDoc);
};

/**
 * OPERAÇÃO DELETE (Deletar)
 * Remove um item "Porque Aderimos" do banco de dados.
 * @param id O ID do item a ser deletado.
 * @returns Uma Promise que resolve para `true` se o item foi deletado, e `false` se não foi encontrado.
 */
export const deletePorqueAderimos = async (id: string): Promise<boolean> => {
    const docRef = porqueAderimosCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return false;

    await docRef.delete();
    return true;
};
