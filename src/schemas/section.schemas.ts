import { z } from "zod";

// Define a "forma" de cada tipo de seção
export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  title: z.string().min(3),
  subtitle: z.string().optional(),
  imageUrl: z.string().url(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

export const textSectionSchema = z.object({
  type: z.literal("text"),
  title: z.string().min(3),
  body: z.string().min(10),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// Novo tipo de seção: Galeria de Imagens
export const imageGallerySectionSchema = z.object({
  type: z.literal("imageGallery"),
  title: z.string().min(3),
  description: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().min(1, { message: "O texto alternativo da imagem é obrigatório para acessibilidade." }),
    caption: z.string().optional(),
  })).min(1, { message: "A galeria de imagens deve conter pelo menos uma imagem." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// Novo tipo de seção: Conteúdo Global (Header/Footer, etc.)
export const globalContentSectionSchema = z.object({
  type: z.literal("globalContent"),
  name: z.string().min(1, { message: "O nome da seção global é obrigatório (ex: 'header', 'footer', 'sidebar')." }),
  // Campos para logo
  logoUrl: z.string().url().optional(),
  logoAlt: z.string().optional(),
  // Campos para links de navegação
  navLinks: z.array(z.object({
    text: z.string().min(1),
    url: z.string().url(),
    target: z.enum(["_self", "_blank"]).default("_self").optional(), // Para abrir em nova aba, por exemplo
  })).optional(),
  // Campos para links de redes sociais
  socialLinks: z.array(z.object({
    platform: z.string().min(1), // Ex: "facebook", "instagram", "twitter"
    url: z.string().url(),
    iconUrl: z.string().url().optional(), // URL para o ícone da rede social
  })).optional(),
  // Campos para texto genérico (ex: copyright, endereço, slogan)
  mainText: z.string().optional(),
  // Campos para informações de contato
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  order: z.number().default(0), // Mantido para consistência, embora possa ser menos relevante para elementos globais
  isActive: z.boolean().default(false), // Para ativar/desativar a exibição do elemento global
});

// Novo tipo de seção: Canais de Denúncia e Delegacias
export const reportingChannelsSectionSchema = z.object({
  type: z.literal("reportingChannels"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),

  // Lista de canais de denúncia gerais (ex: Disque 100)
  channels: z.array(z.object({
    name: z.string().min(1, { message: "O nome do canal é obrigatório." }),
    description: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url({ message: "URL do site inválida." }).optional(),
  })).optional(),

  // Lista de delegacias com contatos
  policeStations: z.array(z.object({
    name: z.string().min(1, { message: "O nome da delegacia é obrigatório." }),
    address: z.string().optional(),
    phone: z.string().min(8, { message: "O telefone deve ser válido." }),
  })).optional(),

  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// Novo tipo de seção: Instituições Parceiras
export const partnerInstitutionsSectionSchema = z.object({
  type: z.literal("partnerInstitutions"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),
  partners: z.array(z.object({
    name: z.string().min(1, { message: "O nome da instituição parceira é obrigatório." }),
    logoUrl: z.string().url({ message: "URL do logo inválida." }),
    websiteUrl: z.string().url({ message: "URL do site inválida." }).optional(),
    description: z.string().optional(),
  })).min(1, { message: "A seção de instituições parceiras deve conter pelo menos uma instituição." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// Schemas para os itens dentro da seção de Depoimentos e Vídeos
export const testimonialItemSchema = z.object({
  type: z.literal("testimonial"),
  quote: z.string({ required_error: "O depoimento é obrigatório." }).min(10, { message: "O depoimento deve ter pelo menos 10 caracteres." }),
  author: z.string({ required_error: "O nome do autor é obrigatório." }).min(3, { message: "O nome do autor deve ter pelo menos 3 caracteres." }),
  role: z.string().optional(), // Ex: "Mãe de vítima", "Professora"
  imageUrl: z.string().url({ message: "URL da imagem do autor inválida." }).optional(), // Foto do autor
});

export const videoItemSchema = z.object({
  type: z.literal("video"),
  title: z.string().min(3, { message: "O título do vídeo é obrigatório." }),
  videoUrl: z.string().url({ message: "URL do vídeo inválida." }), // Link para o vídeo (YouTube, Vimeo, etc.)
  thumbnailUrl: z.string().url({ message: "URL da miniatura do vídeo inválida." }).optional(), // Imagem de capa do vídeo
  description: z.string().optional(),
});

export const postItemSchema = z.object({
  type: z.literal("post"),
  title: z.string().min(3, { message: "O título da postagem é obrigatório." }),
  content: z.string().min(10, { message: "O conteúdo da postagem deve ter pelo menos 10 caracteres." }),
  imageUrl: z.string().url({ message: "URL da imagem da postagem inválida." }).optional(),
  author: z.string().optional(),
  postUrl: z.string().url({ message: "URL da postagem inválida." }).optional(), // Link para a postagem completa
});

// Novo tipo de seção: Depoimentos e Vídeos
export const testimonialsAndVideosSectionSchema = z.object({
  type: z.literal("testimonialsAndVideos"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),
  items: z.array(
    z.discriminatedUnion("type", [testimonialItemSchema, videoItemSchema, postItemSchema])
  ).min(1, { message: "A seção de depoimentos e vídeos deve conter pelo menos um item." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// Schema "guarda-chuva" que valida qualquer um dos tipos de seção definidos.
// O campo 'type' é usado para decidir qual schema usar.
export const anySectionSchema = z.discriminatedUnion("type", [heroSectionSchema, textSectionSchema, imageGallerySectionSchema, globalContentSectionSchema, reportingChannelsSectionSchema, partnerInstitutionsSectionSchema, testimonialsAndVideosSectionSchema]);

// ===================================================================================
// == Schemas para Seções Específicas (CRUDs de Admin)
// ===================================================================================
