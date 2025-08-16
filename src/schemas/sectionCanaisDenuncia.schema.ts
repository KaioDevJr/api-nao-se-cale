import { z } from 'zod';

// Schema para criação de um item de canal de denúncia
export const createCanalDenunciaSchema = z.object({
    quantificador: z.string().min(1, { message: "O quantificador é obrigatório." }),
    valor: z.string().min(1, { message: "O valor é obrigatório." }),
    ordem: z.number().optional(),
});

// Schema para atualização de um item de canal de denúncia
export const updateCanalDenunciaSchema = createCanalDenunciaSchema.partial();

// Schema completo para um item de canal de denúncia
export const canalDenunciaSchema = createCanalDenunciaSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CreateCanalDenuncia = z.infer<typeof createCanalDenunciaSchema>;
export type UpdateCanalDenuncia = z.infer<typeof updateCanalDenunciaSchema>;
export type CanalDenuncia = z.infer<typeof canalDenunciaSchema>;
