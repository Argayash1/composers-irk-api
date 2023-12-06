import { Router } from 'express'; // импортируем роутер из express
import news from './news';
import projects from './projects';

import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';

const router = Router();

router.use('/news', news);
router.use('/projects', projects);

// роут для запросов по несуществующим URL
router.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

export default router;
