import { z } from "zod";

// ===================== Hero Section =====================
export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  subtitle: z.string().optional(),
  imageUrl: z.url({ message: "URL da imagem inválida." }),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Text Section =====================
export const textSectionSchema = z.object({
  type: z.literal("text"),
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  body: z.string().min(10, { message: "O corpo do texto deve ter pelo menos 10 caracteres." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Image Gallery Section =====================
export const imageGallerySectionSchema = z.object({
  type: z.literal("imageGallery"),
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  images: z.array(z.object({
    url: z.url({ message: "URL da imagem inválida." }),
    alt: z.string().min(1, { message: "O texto alternativo da imagem é obrigatório." }),
    caption: z.string().optional(),
  })).min(1, { message: "A galeria deve conter pelo menos uma imagem." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Global Content Section =====================
export const globalContentSectionSchema = z.object({
  type: z.literal("globalContent"),
  name: z.string().min(1, { message: "O nome da seção global é obrigatório." }),
  logoUrl: z.url({ message: "URL inválida." }).optional(),
  logoAlt: z.string().optional(),
  navLinks: z.array(z.object({
    text: z.string().min(1, { message: "O texto do link é obrigatório." }),
    url: z.url({ message: "URL inválida." }),
    target: z.enum(["_self", "_blank"]).default("_self").optional(),
  })).optional(),
  socialLinks: z.array(z.object({
    platform: z.string().min(1, { message: "O nome da rede social é obrigatório." }),
    url: z.url({ message: "URL inválida." }),
    iconUrl: z.url({ message: "URL inválida." }).optional(),
  })).optional(),
  mainText: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Reporting Channels Section =====================
export const reportingChannelsSectionSchema = z.object({
  type: z.literal("reportingChannels"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),
  channels: z.array(z.object({
    name: z.string().min(1, { message: "O nome do canal é obrigatório." }),
    description: z.string().optional(),
    phone: z.string().optional(),
    website: z.url({ message: "URL inválida." }).optional(),
  })).optional(),
  policeStations: z.array(z.object({
    name: z.string().min(1, { message: "O nome da delegacia é obrigatório." }),
    address: z.string().optional(),
    phone: z.string().min(8, { message: "O telefone deve ser válido." }),
  })).optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Partner Institutions Section =====================
export const partnerInstitutionsSectionSchema = z.object({
  type: z.literal("partnerInstitutions"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),
  partners: z.array(z.object({
    name: z.string().min(1, { message: "O nome da instituição parceira é obrigatório." }),
    logoUrl: z.url({ message: "URL do logo inválida." }),
    websiteUrl: z.url({ message: "URL inválida." }).optional(),
    description: z.string().optional(),
  })).min(1, { message: "Deve conter pelo menos uma instituição parceira." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Testimonial / Video / Post Items =====================
export const testimonialItemSchema = z.object({
  type: z.literal("testimonial"),
  quote: z.string().min(10, { message: "O depoimento deve ter pelo menos 10 caracteres." }).optional,
  author: z.string().min(3, { message: "O nome do autor deve ter pelo menos 3 caracteres." }),
  role: z.string().optional(),
  imageUrl: z.url({ message: "URL da imagem inválida." }).optional(),
});

export const videoItemSchema = z.object({
  type: z.literal("video"),
  title: z.string().min(3, { message: "O título do vídeo é obrigatório." }),
  videoUrl: z.url({ message: "URL do vídeo inválida." }),
  thumbnailUrl: z.url({ message: "URL inválida." }).optional(),
  description: z.string().optional(),
});

export const postItemSchema = z.object({
  type: z.literal("post"),
  title: z.string().min(3, { message: "O título da postagem é obrigatório." }),
  content: z.string().min(10, { message: "O conteúdo da postagem deve ter pelo menos 10 caracteres." }),
  imageUrl: z.url({ message: "A URL da imagem é inválida." }).optional(),
  author: z.string().optional(),
  postUrl: z.url({ message: "A URL do post é inválida." }).optional(),
});

// ===================== Testimonials and Videos Section =====================
export const testimonialsAndVideosSectionSchema = z.object({
  type: z.literal("testimonialsAndVideos"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),
  items: z.array(
    z.discriminatedUnion("type", [testimonialItemSchema, videoItemSchema, postItemSchema])
  ).min(1, { message: "Deve conter pelo menos um item." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================================================================================
// == Schemas para Seções Específicas (CRUD de Admin)
// ===================================================================================

// Schema para itens da seção de iniciativas
export const iniciativaItemSchema = z.object({
  type: z.literal("iniciativa"),
  titulo: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  url: z.url({ message: "URL da iniciativa inválida." }),
  ordem: z.number().min(0, { message: "A ordem deve ser um número positivo." }),
  conteudo: z.string().min(10, { message: "O conteúdo deve ter pelo menos 10 caracteres." }),
});

// Schema para a seção de iniciativas
export const sectionIniciativasSchema = z.object({
  type: z.literal("sectionIniciativas"),
  title: z.string().min(3, { message: "O título da seção é obrigatório." }),
  description: z.string().optional(),
  items: z.array(iniciativaItemSchema).min(1, { message: "A seção de iniciativas deve conter pelo menos um item." }),
  order: z.number().default(0),
  isActive: z.boolean().default(false),
});

// ===================== Any Section Schema =====================
export const anySectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  textSectionSchema,
  imageGallerySectionSchema,
  globalContentSectionSchema,
  reportingChannelsSectionSchema,
  partnerInstitutionsSectionSchema,
  testimonialsAndVideosSectionSchema,
  sectionIniciativasSchema
]);



