import { Router } from 'express'; // импортируем роутер из express
import news from './news';
import projects from './projects';
import members from './members';
import articles from './articles';
import audios from './audios';
import reports from './reports';
import scores from './scores';
import videos from './videos';
import ourHistory from './ourHistory';
import search from './search';

import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import { NOT_FOUND_ERROR_MESSAGE } from '../utils/constants';

const router = Router();

router.use('/news', news);
router.use('/projects', projects);
router.use('/members', members);
router.use('/articles', articles);
router.use('/audios', audios);
router.use('/reports', reports);
router.use('/scores', scores);
router.use('/videos', videos);
router.use('/ourHistory', ourHistory);
router.use('/search', search);

// роут для запросов по несуществующим URL
router.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

export default router;
