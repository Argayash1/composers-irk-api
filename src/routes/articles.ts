import { Router } from 'express'; // импортируем роутер из express

import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleTextData,
  updateArticleImage,
  deleteArticleById,
} from '../controllers/articles';

import {
  articleDataValidator,
  articleQueryParamsValidator,
  articleTextDataValidator,
  articleImageUrlValidator,
  articleIdValidator,
} from '../middlwares/validators/articleValidator';

const router = Router();

router.get('/', articleQueryParamsValidator, getArticles);

router.post('/', articleDataValidator, createArticle);

router.get('/:articleId', articleIdValidator, getArticleById);

router.patch('/:articleId', articleIdValidator, articleTextDataValidator, updateArticleTextData);

router.patch('/:articleId/image', articleIdValidator, articleImageUrlValidator, updateArticleImage);

router.delete('/:articleId', articleIdValidator, deleteArticleById);

export default router;
