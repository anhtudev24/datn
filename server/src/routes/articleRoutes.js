import express from 'express';
import { getArticles, getArticleBySlug, addComment } from '../controllers/articleController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/:id/comments', authenticate, addComment);

export default router;
