import { db, admin } from './firebase.js';
import { Testimonial, CreateTestimonial, UpdateTestimonial } from '../schemas/testimonials.schema';
import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
// Importa o banco de dados Firestore e o módulo admin do Firebase para manipulação de dados.
//  A coleção 'testimonials' é usada para armazenar depoimentos de usuários.


const testimonialsCollection = db.collection('testimonials');
// A coleção 'testimonials' é referenciada para facilitar as operações CRUD.


/**
 * Função auxiliar para converter um documento do Firestore em um objeto Testimonial.
 * Ela garante que os dados retornados para a aplicação tenham o formato correto e seguro.
 * @param doc Um snapshot de um documento do Firestore.
 * @returns Um objeto do tipo Testimonial, com os campos tipados.
 */
const toTestimonial = (doc: DocumentSnapshot<DocumentData>): Testimonial => {
    // Verifica se o documento contém dados.
    // Se não houver dados, lança um erro para evitar que a aplicação quebre.
    const data = doc.data();
    if (!data) {
        // Esta verificação de segurança garante que a aplicação não quebre se, por algum motivo,
        // um documento existir mas não tiver dados.
        throw new Error(`Document data is empty for doc ${doc.id}`);
    }
    return {
        id: doc.id,
        quote: data.quote,
        author: data.author,
        role: data.role,
        imageUrl: data.imageUrl,
        // Os campos de data no Firestore são armazenados em um formato de Timestamp.
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        // O método `.toDate()` converte esse formato para um objeto Date padrão do JavaScript,
        // que é mais fácil de ser manipulado no frontend.
    };
};

/**
 * OPERAÇÃO READ (Ler)
 * Busca todos os depoimentos, ordenados pela data de criação.
 * @returns Uma Promise que resolve para um array de objetos Testimonial.
 */

//A expressão Promise<Testimonial[]> é uma anotação de tipo do TypeScript
//  que descreve o que a função getTestimonials vai retornar.
export const getTestimonials = async (): Promise<Testimonial[]> => {
  // 1. Acessa a coleção 'testimonials' e ordena os documentos pelo campo 'createdAt' em ordem decrescente.
  //    Isso garante que os depoimentos mais novos apareçam primeiro.
  const snapshot = await testimonialsCollection.orderBy('createdAt', 'desc').get();

  // 2. O 'snapshot.docs' contém um array com todos os documentos encontrados.
  // 3. O método `.map()` itera sobre cada documento e chama a função auxiliar `toTestimonial`
  //    para converter cada um no formato Testimonial.
  return snapshot.docs.map(toTestimonial);
};


/**
 * OPERAÇÃO READ (Ler)
 * Busca um depoimento específico pelo seu ID.
 * @param id O ID do depoimento a ser buscado.
 * @returns Uma Promise que resolve para o objeto Testimonial, ou `null` se o ID não for encontrado.
 */
export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
    // 1. Cria uma referência direta ao documento usando o ID fornecido.
    const docRef = testimonialsCollection.doc(id);
    // 2. Executa a busca (.get()) para obter os dados do documento.
    const doc = await docRef.get();

    // 3. Verifica se o documento realmente existe no banco de dados.
    if (!doc.exists) {
        return null; // Se não existir, retorna nulo para que o controller possa tratar o erro 404 (Not Found).
    }

    // 4. Se o documento existe, usa a função auxiliar para formatá-lo e retorná-lo.
    return toTestimonial(doc);
};

/**
 * OPERAÇÃO CREATE (Criar)
 * Adiciona um novo depoimento ao banco de dados.
 * @param data Um objeto com os dados do novo depoimento (quote, author, etc.), já validado pelo Zod no controller.
 * @returns Uma Promise que resolve para o objeto Testimonial completo e recém-criado, incluindo seu novo ID e timestamps.
 */
export const createTestimonial = async (data: CreateTestimonial): Promise<Testimonial> => {
    const now = admin.firestore.FieldValue.serverTimestamp();
    // `admin.firestore.FieldValue.serverTimestamp()` é um valor especial que instrui o Firestore
    // a preencher os campos `createdAt` e `updatedAt` com a data e hora do servidor no momento da criação.
    // Isso garante consistência e evita problemas com fusos horários do cliente.
    const newTestimonialData = {
        ...data,
        // 1. Espalha os dados do depoimento recebido, que já foram validados pelo Zod.
        createdAt: now,
        // 2. Define o campo `createdAt` com o timestamp do servidor.
        updatedAt: now,
        // 3. Define o campo `updatedAt` com o mesmo timestamp, pois é um novo depoimento.
    };

    const docRef = await testimonialsCollection.add(newTestimonialData);    
    // 1. O método `.add()` cria um novo documento na coleção 'testimonials' com um ID gerado automaticamente.
    const newDoc = await docRef.get();
    // 2. Após a criação, fazemos uma nova busca (.get()) pelo documento recém-criado.
    //    Isso é necessário para obter os valores que o servidor acabou de gerar (o ID e os timestamps).
    return toTestimonial(newDoc);
    // 3. Converte o documento completo para o formato Testimonial e o retorna.
};

/**
 * OPERAÇÃO UPDATE (Atualizar)
 * Modifica um depoimento existente no banco de dados.
 * @param id O ID do depoimento a ser atualizado.
 * @param data Um objeto com os campos que devem ser alterados.
 * @returns Uma Promise que resolve para o objeto Testimonial com os dados atualizados, ou `null` se o ID não for encontrado.
 */
export const updateTestimonial = async (id: string, data: UpdateTestimonial): Promise<Testimonial | null> => {
    // 1. Cria a referência ao documento que queremos atualizar.
    const docRef = testimonialsCollection.doc(id);
    // 2. Busca o documento para garantir que ele existe antes de tentar atualizá-lo.
    const doc = await docRef.get();
    if (!doc.exists) return null; // Retorna nulo se o documento não for encontrado.
    
    // 3. O método `.update()` modifica apenas os campos fornecidos no objeto `data`.
    //    Também atualizamos o campo `updatedAt` com o timestamp atual do servidor.
    await docRef.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    // 4. Após a atualização, buscamos novamente o documento para obter a versão mais recente dos dados.
    const updatedDoc = await docRef.get();
    // 5. Retorna o documento atualizado e formatado.
    return toTestimonial(updatedDoc);
    // 6. A função `toTestimonial` garante que o objeto retornado esteja no formato correto.
};

/**
 * OPERAÇÃO DELETE (Deletar)
 * Remove um depoimento do banco de dados.
 * Verifica primeiro se o documento existe para fornecer um feedback mais preciso.
 * @param id O ID do depoimento a ser deletado.
 * @returns Uma Promise que resolve para `true` se o item foi deletado, e `false` se não foi encontrado.
 */
export const deleteTestimonial = async (id: string): Promise<boolean> => {
    // 1. Cria a referência ao documento que será deletado.
    const docRef = testimonialsCollection.doc(id);
    const doc = await docRef.get();

    // 2. Verifica se o documento existe antes de tentar deletar.
    if (!doc.exists) return false;

    await docRef.delete();
    return true;
};