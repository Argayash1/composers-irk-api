import { Router } from 'express'; // импортируем роутер из express

import { getOurHistory, createOurHistory, updateOurHistoryData, deleteOurHistoryById } from '../controllers/ourHistory';
import { ourHistoryDataValidator, ourHistoryIdValidator } from '../middlwares/validators/historyValidator';

const router = Router();

router.get('/', getOurHistory);

router.post('/', ourHistoryDataValidator, createOurHistory);

router.patch('/:historyId', ourHistoryIdValidator, ourHistoryDataValidator, updateOurHistoryData);

router.delete('/:historyId', ourHistoryIdValidator, deleteOurHistoryById);

export default router;
