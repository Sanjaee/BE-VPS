import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Route publik
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Route yang memerlukan autentikasi
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;
