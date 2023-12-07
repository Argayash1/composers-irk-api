import { Router } from 'express'; // импортируем роутер из express

import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleTextData,
  updateArticleImage,
  deleteArticleById,
} from '../controllers/articles';

const router = Router();

router.get('/', getArticles);

router.post('/', createArticle);

router.get('/:articleId', getArticleById);

router.patch('/:articleId', updateArticleTextData);

router.patch('/:articleId/image', updateArticleImage);

router.delete('/:articleId', deleteArticleById);

export default router;
