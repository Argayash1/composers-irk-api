import { Router } from 'express'; // импортируем роутер из express

import {
  getNews,
  getNewsById,
  createNews,
  deleteNewsById,
  updateNewsTextData,
  updateNewsImage,
} from '../controllers/news';

const router = Router();

router.get('/', getNews);

router.post('/', createNews);

router.get('/:newsId', getNewsById);

router.patch('/:newsId', updateNewsTextData);

router.patch('/:newsId/image', updateNewsImage);

router.delete('/:newsId', deleteNewsById);

export default router;
