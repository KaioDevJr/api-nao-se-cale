import { db, admin } from './firebase';
import { CanalDenuncia, CreateCanalDenuncia, UpdateCanalDenuncia } from '../schemas/sectionCanaisDenuncia.schema';
import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

const canaisDenunciaCollection = db.collection('sectionCanaisDenuncia');

/**
 * Função auxiliar para converter um documento do Firestore em um objeto CanalDenuncia.
 * @param doc Um snapshot de um documento do Firestore.
 * @returns Um objeto do tipo CanalDenuncia, com os campos tipados.
 */
const toCanalDenuncia = (doc: DocumentSnapshot<DocumentData>): CanalDenuncia => {
    const data = doc.data();
    if (!data) {
        throw new Error(`Document data is empty for doc ${doc.id}`);
    }
    return {
        id: doc.id,
        quantificador: data.quantificador,
        valor: data.valor,
        ordem: data.ordem,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    };
};

/**
 * Função auxiliar para obter a próxima ordem disponível
 * @returns A próxima ordem disponível (maior ordem + 1)
 */
const getNextOrder = async (): Promise<number> => {
    const snapshot = await canaisDenunciaCollection.orderBy('ordem', 'desc').limit(1).get();
    
    if (snapshot.empty) {
        return 1; // Se não há documentos, começa com 1
    }
    
    const lastDoc = snapshot.docs[0];
    const data = lastDoc.data();
    // Garante que ordem seja tratada como número
    const currentOrder = Number(data.ordem) || 0;
    return currentOrder + 1;
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca todos os canais de denúncia, ordenados pela ordem.
 * @returns Uma Promise que resolve para um array de objetos CanalDenuncia.
 */
export const getCanaisDenuncia = async (): Promise<CanalDenuncia[]> => {
    const snapshot = await canaisDenunciaCollection.orderBy('ordem', 'asc').get();
    return snapshot.docs.map(toCanalDenuncia);
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca um canal de denúncia específico pelo seu ID.
 * @param id O ID do canal de denúncia a ser buscado.
 * @returns Uma Promise que resolve para o objeto CanalDenuncia, ou `null` se o ID não for encontrado.
 */
export const getCanalDenunciaById = async (id: string): Promise<CanalDenuncia | null> => {
    const docRef = canaisDenunciaCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    return toCanalDenuncia(doc);
};

/**
 * OPERAÇÃO CREATE (Criar)
 * Adiciona um novo canal de denúncia ao banco de dados.
 * @param data Um objeto com os dados do novo canal de denúncia, já validado pelo Zod no controller.
 * @returns Uma Promise que resolve para o objeto CanalDenuncia completo e recém-criado.
 */
export const createCanalDenuncia = async (data: CreateCanalDenuncia): Promise<CanalDenuncia> => {
    const now = admin.firestore.FieldValue.serverTimestamp();
    
    // Se a ordem não foi fornecida, calcula a próxima ordem disponível
    let ordem = data.ordem;
    if (ordem === undefined) {
        ordem = await getNextOrder();
    }

    const newCanalDenunciaData = {
        ...data,
        ordem,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await canaisDenunciaCollection.add(newCanalDenunciaData);
    const newDoc = await docRef.get();
    return toCanalDenuncia(newDoc);
};

/**
 * OPERAÇÃO UPDATE (Atualizar)
 * Modifica um canal de denúncia existente no banco de dados.
 * @param id O ID do canal de denúncia a ser atualizado.
 * @param data Um objeto com os campos que devem ser alterados.
 * @returns Uma Promise que resolve para o objeto CanalDenuncia com os dados atualizados, ou `null` se o ID não for encontrado.
 */
export const updateCanalDenuncia = async (id: string, data: UpdateCanalDenuncia): Promise<CanalDenuncia | null> => {
    const docRef = canaisDenunciaCollection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return null;
    
    await docRef.update({ 
        ...data, 
        updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    const updatedDoc = await docRef.get();
    return toCanalDenuncia(updatedDoc);
};

/**
 * OPERAÇÃO DELETE (Deletar)
 * Remove um canal de denúncia do banco de dados.
 * @param id O ID do canal de denúncia a ser deletado.
 * @returns Uma Promise que resolve para `true` se o item foi deletado, e `false` se não foi encontrado.
 */
export const deleteCanalDenuncia = async (id: string): Promise<boolean> => {
    const docRef = canaisDenunciaCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return false;

    await docRef.delete();
    return true;
};
