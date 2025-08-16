import { Request, Response } from 'express';
import * as PostService from '../services/posts.service.js';
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema.js';
import { z } from "zod";

export const createPost = async (req: Request, res: Response) => {
  try {        
    const validation = createPostSchema.safeParse(req.body);
    if (!validation.success) {        
      return res.status(400).json({error: z.treeifyError(validation.error)
      });
    }
    const post = await PostService.createPost(validation.data);
    res.status(201).json(post);
} catch (e: any) {
  console.error("Error creating post:", e);
  res.status(500).json({ error: 'Failed to create post.' });
}
};

export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await PostService.getPosts();
    res.json(posts);
  } catch (e: any) {
    console.error("Error fetching posts:", e);
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await PostService.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (e: any) {
    console.error(`Error fetching post ${req.params.id}:`, e);
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updatePostSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }
        const updatedPost = await PostService.updatePost(id, validation.data);
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (e: any) {
        console.error(`Error updating post ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to update post.' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const wasDeleted = await PostService.deletePost(id);
        if (!wasDeleted) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send(); 
    } catch (e: any) {
        console.error(`Error deleting post ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to delete post.' });
    }
};