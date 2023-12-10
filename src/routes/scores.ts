import { Router } from 'express'; // импортируем роутер из express

import { getScores, createScore, updateScoreTextData, updateScoreUrl, deleteScoreById } from '../controllers/scores';

const router = Router();

router.get('/', getScores);

router.post('/', createScore);

router.patch('/:scoreId', updateScoreTextData);

router.patch('/:scoreId/link', updateScoreUrl);

router.delete('/:scoreId', deleteScoreById);

export default router;
