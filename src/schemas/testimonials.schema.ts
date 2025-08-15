import { z } from 'zod';
import { testimonialItemSchema } from './section.schemas.js';

// O schema para criação de um depoimento individual é derivado do schema de item de depoimento,
// omitindo o campo 'type', que é relevante apenas dentro de uma seção.
export const createTestimonialSchema = testimonialItemSchema.omit({ type: true });


export const updateTestimonialSchema = createTestimonialSchema.partial();

// O schema para atualização de um depoimento é semelhante ao de criação, mas permite que todos os campos sejam opcionais,

export const testimonialSchema = createTestimonialSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});


export type CreateTestimonial = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonial = z.infer<typeof updateTestimonialSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
