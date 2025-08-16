import { z } from 'zod';
import { iniciativaItemSchema } from './section.schemas.js';

// O schema para criação de uma iniciativa individual é derivado do schema de item de iniciativa,
// omitindo o campo 'type', que é relevante apenas dentro de uma seção.
// Também torna os campos 'ordem' e 'url' opcionais para facilitar o cadastro.
export const createIniciativaSchema = iniciativaItemSchema.omit({ type: true }).extend({
    ordem: z.number().optional(),
    url: z.string().url().optional()
});

// O schema para atualização de uma iniciativa é semelhante ao de criação, mas permite que todos os campos sejam opcionais
export const updateIniciativaSchema = createIniciativaSchema.partial();

// O schema completo para uma iniciativa inclui os campos de metadados
export const iniciativaSchema = createIniciativaSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CreateIniciativa = z.infer<typeof createIniciativaSchema>;
export type UpdateIniciativa = z.infer<typeof updateIniciativaSchema>;
export type Iniciativa = z.infer<typeof iniciativaSchema>;
