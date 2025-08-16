import { z } from 'zod';
import { postItemSchema } from './section.schemas';

export const createPostSchema = postItemSchema.omit({ type: true });

export const updatePostSchema = createPostSchema.partial();

export const postSchema = createPostSchema.extend({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type Post = z.infer<typeof postSchema>;
