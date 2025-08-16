import { Router } from "express";
import {
  findAllCarrossel, //section0   
  findAllNaoSeCale, //section1
  findAllPorqueAderimos, //section2
  findAllCanaisDenuncia, //section3
  findByIdCanalDenuncia,
  findAllCurso, //section4
  findAllIniciativas, //section5
  findAllInstParceiras, //section6
  findAllDepoimentos,   //section7
  findByIdDepoimento,
  findAllPostsDestaque, //section8
  getLastPosts, 
  findByIdPost, 
  findAllDocumentos, //section9 
  findByIdDocuments, 
  findAllSPporTodas //section10
} from "../services/public.Service";
import * as iniciativaController from '../controllers/sectionIniciativas.controller';

const router = Router();

router.get("/", async (req, res) => {
  try {
    // ISSO FICA DENTRO DE PUBLIC.SERVICE.TS
    const section0Carrossel = await findAllCarrossel();
    const section1NaoSeCale = await findAllNaoSeCale(); 
    const section2PorqueAderimos = await findAllPorqueAderimos();
    const section3CanaisDenuncia = await findAllCanaisDenuncia();
    const section4Curso = await findAllCurso();
    const section5Iniciativas = await findAllIniciativas();
    const section6InstParceiras = await findAllInstParceiras();
    const section7Depoimentos = await findAllDepoimentos();
    const section8PostsDestaque = await findAllPostsDestaque();
    const section9Documentos = await findAllDocumentos();
    const section10SPporTodas = await findAllSPporTodas();     

    return res.status(200).json({
      section0Carrossel,
      section1NaoSeCale,
      section2PorqueAderimos,
      section3CanaisDenuncia,
      section4Curso,
      section5Iniciativas,
      section6InstParceiras,
      section7Depoimentos,
      section8PostsDestaque,
      section9Documentos,
      section10SPporTodas
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Rotas públicas de iniciativas
router.get("/iniciativas", iniciativaController.getIniciativas);
router.get("/iniciativas/:id", iniciativaController.getIniciativaById);

// Rotas públicas de canais de denúncia
router.get("/canaisDenuncia", async (req, res) => {
  try {
    const canaisDenuncia = await findAllCanaisDenuncia();
    return res.status(200).json(canaisDenuncia);
  } catch (error) {
    return res.status(500).json({msg: "Erro interno do servidor"});
  }
});

router.get("/testimonials/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const depoimento = await findByIdDepoimento(id);
    if(depoimento) {
      return res.status(200).json(depoimento);
    } else {
      return res.status(404).json({msg:"Depoimento não encontrado"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno do servidor"});
  }
});

router.get("/canaisDenuncia/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const canalDenuncia = await findByIdCanalDenuncia(id);
    if(canalDenuncia) {
      return res.status(200).json(canalDenuncia);
    } else {
      return res.status(404).json({msg:"Canal de denúncia não encontrado"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno do servidor"});
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await findByIdPost(id);
    if(post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({msg:"Post não encontrado"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno do servidor"});
  }
 });

router.get("/lastPosts", async (req, res) => {
  try {
    const lastPosts = await getLastPosts();
    if(lastPosts) {
      return res.status(200).json(lastPosts);
    } else {
      return res.status(404).json({msg:"Posts não encontrados"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno do servidor"});
  }
});

router.get("/documents/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const document = await findByIdDocuments(id);
    if(document) {
      return res.status(200).json(document);
    } else {
      return res.status(404).json({msg:"Documento não encontrado"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno do servidor"});
  }
});

export default router;
