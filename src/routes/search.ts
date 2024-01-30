import { Router } from 'express'; // импортируем роутер из express

import { getSearchResults } from '../controllers/search';

const router = Router();

router.get('/', getSearchResults);

export default router;
