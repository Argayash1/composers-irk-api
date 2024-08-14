import { Router } from 'express'; // импортируем роутер из express

import {
  getNews,
  getNewsById,
  createNews,
  deleteNewsById,
  deleteMultipleNewsByIds,
  updateNews,
} from '../controllers/news';

import {
  newsDataValidator,
  newsIdValidator,
  newsQueryParamsValidator,
} from '../middlwares/validators/newsValidator';

const router = Router();

router.get('/', newsQueryParamsValidator, getNews);

router.post('/', newsDataValidator, createNews);

router.delete('/', deleteMultipleNewsByIds)

router.get('/:newsId', newsIdValidator, getNewsById);

router.patch('/:newsId', newsIdValidator, newsDataValidator, updateNews);

router.delete('/:newsId', newsIdValidator, deleteNewsById);

export default router;
