import { z } from 'zod';

// Schema para criação de um item "Porque Aderimos"
export const createPorqueAderimosSchema = z.object({
  conteudo: z.string().min(1, { message: "O conteúdo é obrigatório." }),
  titulo: z.string().min(1, { message: "O título é obrigatório." }),
  url: z.string().min(1, { message: "A URL é obrigatória." }),
});

// Schema para atualização - todos os campos são opcionais
export const updatePorqueAderimosSchema = createPorqueAderimosSchema.partial();

// Schema completo incluindo campos do sistema
export const porqueAderimosSchema = createPorqueAderimosSchema.extend({
  id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Tipos TypeScript derivados dos schemas
export type CreatePorqueAderimos = z.infer<typeof createPorqueAderimosSchema>;
export type UpdatePorqueAderimos = z.infer<typeof updatePorqueAderimosSchema>;
export type PorqueAderimos = z.infer<typeof porqueAderimosSchema>;
