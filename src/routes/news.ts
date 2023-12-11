import { Router } from 'express'; // импортируем роутер из express

import {
  getNews,
  getNewsById,
  createNews,
  deleteNewsById,
  updateNewsTextData,
  updateNewsImage,
} from '../controllers/news';

import {
  newsDataValidator,
  newsIdValidator,
  newsImageUrlValidator,
  newsQueryParamsValidator,
  newsTextDataValidator,
} from '../middlwares/validators/newsValidator';

const router = Router();

router.get('/', newsQueryParamsValidator, getNews);

router.post('/', newsDataValidator, createNews);

router.get('/:newsId', newsIdValidator, getNewsById);

router.patch('/:newsId', newsIdValidator, newsTextDataValidator, updateNewsTextData);

router.patch('/:newsId/image', newsIdValidator, newsImageUrlValidator, updateNewsImage);

router.delete('/:newsId', newsIdValidator, deleteNewsById);

export default router;
