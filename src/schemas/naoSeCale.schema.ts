import { z } from 'zod';

// Schema for creating a NaoSeCale section item
export const createNaoSeCaleSchema = z.object({
    url: z.string().url({ message: "URL da imagem deve ser válida." }),
    conteudo: z.string().min(1, { message: "O conteúdo é obrigatório." }),
});

// Schema for updating a NaoSeCale section item (all fields optional)
export const updateNaoSeCaleSchema = createNaoSeCaleSchema.partial();

// Complete schema for a NaoSeCale section item (includes id and timestamps)
export const naoSeCaleSchema = createNaoSeCaleSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// TypeScript types derived from the schemas
export type CreateNaoSeCale = z.infer<typeof createNaoSeCaleSchema>;
export type UpdateNaoSeCale = z.infer<typeof updateNaoSeCaleSchema>;
export type NaoSeCale = z.infer<typeof naoSeCaleSchema>;
