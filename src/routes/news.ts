import { Router } from 'express'; // импортируем роутер из express

import { getNews, createNews } from '../controllers/news';

const router = Router();

router.get('/', getNews);

router.post('/', createNews);

export default router;
