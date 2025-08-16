import { Router } from 'express';
import * as postController from '../controllers/posts.controller';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/', postController.getPosts);
router.post('/', postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;