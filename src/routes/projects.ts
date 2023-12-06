import { Router } from 'express'; // импортируем роутер из express

import { getNews, createNews, deleteNewsById } from '../controllers/news';

const router = Router();

router.get('/', getNews);

router.post('/', createNews);

router.delete('/:_id', deleteNewsById);

export default router;
