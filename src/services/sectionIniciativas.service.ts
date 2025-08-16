import { db, admin } from './firebase.js';
import { Iniciativa, CreateIniciativa, UpdateIniciativa } from '../schemas/sectionIniciativas.schema.js';
import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

const sectionIniciativasCollection = db.collection('sectionIniciativas');

/**
 * Função auxiliar para converter um documento do Firestore em um objeto Iniciativa.
 * Ela garante que os dados retornados para a aplicação tenham o formato correto e seguro.
 * @param doc Um snapshot de um documento do Firestore.
 * @returns Um objeto do tipo Iniciativa, com os campos tipados.
 */
const toIniciativa = (doc: DocumentSnapshot<DocumentData>): Iniciativa => {
    const data = doc.data();
    if (!data) {
        throw new Error(`Document data is empty for doc ${doc.id}`);
    }
    
    // Verifica se os campos de data existem e converte para Date
    const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();
    const updatedAt = data.updatedAt ? data.updatedAt.toDate() : new Date();
    
    return {
        id: doc.id,
        titulo: data.titulo || '',
        url: data.url || null,
        ordem: data.ordem || 0,
        conteudo: data.conteudo || '',
        createdAt,
        updatedAt,
    };
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca todas as iniciativas, ordenadas pela ordem.
 * @returns Uma Promise que resolve para um array de objetos Iniciativa.
 */
export const getIniciativas = async (): Promise<Iniciativa[]> => {
    const snapshot = await sectionIniciativasCollection.orderBy('ordem', 'asc').get();
    return snapshot.docs.map(toIniciativa);
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca uma iniciativa específica pelo seu ID.
 * @param id O ID da iniciativa a ser buscada.
 * @returns Uma Promise que resolve para o objeto Iniciativa, ou `null` se o ID não for encontrado.
 */
export const getIniciativaById = async (id: string): Promise<Iniciativa | null> => {
    console.log(`Buscando iniciativa com ID: ${id}`);
    const docRef = sectionIniciativasCollection.doc(id);
    const doc = await docRef.get();

    console.log(`Documento existe (GET): ${doc.exists}`);
    if (!doc.exists) {
        console.log(`Documento não encontrado para ID (GET): ${id}`);
        return null;
    }

    console.log(`Documento encontrado para ID (GET): ${id}`);
    return toIniciativa(doc);
};

/**
 * OPERAÇÃO CREATE (Criar)
 * Adiciona uma nova iniciativa ao banco de dados.
 * @param data Um objeto com os dados da nova iniciativa, já validado pelo Zod no controller.
 * @returns Uma Promise que resolve para o objeto Iniciativa completo e recém-criado.
 */
export const createIniciativa = async (data: CreateIniciativa): Promise<Iniciativa> => {
    const now = admin.firestore.FieldValue.serverTimestamp();
    
    // Se a ordem não foi fornecida, busca a maior ordem existente e adiciona 1
    let ordem = data.ordem;
    if (ordem === undefined) {
        console.log('Ordem não fornecida, buscando maior ordem existente...');
        
        // Busca todos os documentos para garantir que encontramos a maior ordem
        const snapshot = await sectionIniciativasCollection.get();
        const docs = snapshot.docs;
        
        if (docs.length > 0) {
            // Encontra a maior ordem entre todos os documentos
            let maxOrdem = 0;
            docs.forEach(doc => {
                const docOrdem = Number(doc.data().ordem) || 0;
                if (docOrdem > maxOrdem) {
                    maxOrdem = docOrdem;
                }
            });
            
            ordem = maxOrdem + 1;
            console.log(`Total de documentos: ${docs.length}, maior ordem encontrada: ${maxOrdem}, nova ordem será: ${ordem}`);
        } else {
            ordem = 1;
            console.log('Nenhum documento encontrado, ordem será: 1');
        }
    } else {
        console.log(`Ordem fornecida pelo usuário: ${ordem}`);
    }
    
    const newIniciativaData = {
        ...data,
        ordem,
        createdAt: now,
        updatedAt: now,
    };

    console.log(`Criando nova iniciativa com ordem: ${ordem}`);
    const docRef = await sectionIniciativasCollection.add(newIniciativaData);
    const newDoc = await docRef.get();
    return toIniciativa(newDoc);
};

/**
 * OPERAÇÃO UPDATE (Atualizar)
 * Modifica uma iniciativa existente no banco de dados.
 * @param id O ID da iniciativa a ser atualizada.
 * @param data Um objeto com os campos que devem ser alterados.
 * @returns Uma Promise que resolve para o objeto Iniciativa com os dados atualizados, ou `null` se o ID não for encontrado.
 */
export const updateIniciativa = async (id: string, data: UpdateIniciativa): Promise<Iniciativa | null> => {
    const docRef = sectionIniciativasCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    await docRef.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    const updatedDoc = await docRef.get();
    return toIniciativa(updatedDoc);
};

/**
 * OPERAÇÃO DELETE (Deletar)
 * Remove uma iniciativa do banco de dados.
 * @param id O ID da iniciativa a ser deletada.
 * @returns Uma Promise que resolve para `true` se o item foi deletado, e `false` se não foi encontrado.
 */
export const deleteIniciativa = async (id: string): Promise<boolean> => {
    console.log(`Tentando deletar iniciativa com ID: ${id}`);
    const docRef = sectionIniciativasCollection.doc(id);
    const doc = await docRef.get();

    console.log(`Documento existe: ${doc.exists}`);
    if (!doc.exists) {
        console.log(`Documento não encontrado para ID: ${id}`);
        return false;
    }

    console.log(`Deletando documento com ID: ${id}`);
    await docRef.delete();
    console.log(`Documento deletado com sucesso: ${id}`);
    return true;
};
