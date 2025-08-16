import { db } from "./firebase.js"

// Section 0 - Carrossel
async function findAllCarrossel() {
  const snap = await db.collection("sectionCarrossel").get(); 
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Section 1 - NaoSeCale
async function findAllNaoSeCale() {
  const documents = await db.collection("sectionNaoSeCale").get();
  const produtos: any[] = [];
  documents.forEach((doc) => {
    const produto = { ...doc.data(), id: doc.id };
    produtos.push(produto);
  });
  return produtos;
};

// Section 2 - PorqueAderimos
async function findAllPorqueAderimos (){
  const documents = await db.collection("sectionPorqueAderimos").get();
  const produtos: any[] = [] ;
  documents.forEach(doc => {
    const produto = { ...doc.data(), id: doc.id };
    produtos.push(produto);
  });
  return produtos;
};

// Section 3 - Canais Denúncia
async function findAllCanaisDenuncia() {
  const documents = await db.collection("sectionCanaisDenuncia").get();
  const denuncias: any[] = [];
  documents.forEach(doc => {
    const denuncia = { ...doc.data(), id: doc.id };
    denuncias.push(denuncia);
  });
  return denuncias;
};

// Section 3 - Canal de Denúncia pelo ID
async function findByIdCanalDenuncia(id: string) {
  const doc = await db.collection("sectionCanaisDenuncia").doc(id).get();
  if(doc.exists) {
    const canalDenuncia = { id: doc.id, ...doc.data() }
    return canalDenuncia;
  } else {
    return null;
  }
};

// Section 4 - Curso 
async function findAllCurso() {
  const documents = await db.collection("sectionCurso").get();
  const cursos: any[] = [];
  documents.forEach(doc => {
    const curso = { ...doc.data(), id: doc.id };
    cursos.push(curso);
  });
  return cursos;
};

// Section 5 - Iniciativas
async function findAllIniciativas() {
  const documents = await db.collection("sectionIniciativas").get();
  const dados: any[] = [];
  documents.forEach((doc) => {
    const dado = { ...doc.data(), id: doc.id };
    dados.push(dado);
  });
  return dados;
};

// Section 6 - InstParceiras
async function findAllInstParceiras() {
  const documents = await db.collection("sectionInstParceiras").get();
  const empresas: any[] = [];
  documents.forEach(doc => {
    const empresa = { ...doc.data(), id: doc.id };
    empresas.push(empresa);
  });
  return empresas;
};

//Section 7 e 14 - Depoimentos em video
async function findAllDepoimentos() {
    const documents = await db.collection("sectionDepoimentos").get();
    const dados: any[] = [] ;
    documents.forEach(doc => {
        const dado = { ...doc.data(), id: doc.id };
        dados.push(dado);
    });
    
    return dados;
};

//Section 7 e 11 - Depoimento pelo ID
async function findByIdDepoimento(id: string) {
  const doc =  await db.collection("sectionDepoimentos").doc(id).get();
  if(doc.exists) {
    const post = { id: doc.id, ...doc.data() }
    return post;
  } else {
    return null;
  }
};

// Section 8 e 13 -  PostsDestaque - Pegar todos
async function findAllPostsDestaque() {
  const documents = await db.collection("sectionPostsDestaque").get();
  const dados: any[] = [] ;
  documents.forEach(doc => {
    const dado = { ...doc.data(), id: doc.id };
    dados.push(dado);
  });
  return dados;
};

// Section 8 -  PostsDestaque - Pegar só os últimos 3
async function getLastPosts() {
  const documents = await db.collection("sectionPostsDestaque")
    .orderBy("createdAt", "desc").limit(3).get();
  return documents.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Section 8 e 12 -  PostsDestaque - Post pelo ID
async function findByIdPost(id: string) {
  const doc =  await db.collection("sectionPostsDestaque").doc(id).get();
  if(doc.exists) {
    const post = { id: doc.id, ...doc.data() }
    return post;
  } else {
    return null;
  }
};

// Section 9 - Documentos
async function findAllDocumentos() {
  const documents = await db.collection("sectionDocumentos").get();
  const dados: any[] = [] ;
  documents.forEach(doc => {
    const dado = { ...doc.data(), id: doc.id };
    dados.push(dado);
  });
  return dados;
};

// Section 9 -  Documentos pelo ID
async function findByIdDocuments(id: string) {
  const doc =  await db.collection("sectionDocumentos").doc(id).get();
  if(doc.exists) {
    const document = { id: doc.id, ...doc.data() }
    return document;
  } else {
    return null;
  }
};

// Section 10 - (GIFS) SPporTodas
async function findAllSPporTodas() {
  const documents = await db.collection("sectionSPporTodas").get();
  const gifs: any[] = [];
  documents.forEach((doc) => {
    const gif = {...doc.data(), id: doc.id };
    gifs.push(gif);
  });
  return gifs;
};

export {
  findAllCarrossel,        // section0
  findAllNaoSeCale,        // section1
  findAllPorqueAderimos,   // section2
  findAllCanaisDenuncia,   // section3
  findByIdCanalDenuncia,   // section3 ById
  findAllCurso,            // section4
  findAllIniciativas,      // section5
  findAllInstParceiras,    // section6
  findAllDepoimentos,      // section7 e 14
  findByIdDepoimento,      // section7 e 11 ById
  findAllPostsDestaque,    // section8 e 13
  getLastPosts,            // section8 ultimos 3
  findByIdPost,            // section8 e 12 ById
  findAllDocumentos,       // section9
  findByIdDocuments,       // section9 ById
  findAllSPporTodas        // section10  
};
