import { Router } from 'express'; // импортируем роутер из express

import { getAudios, createAudio, updateAudioTextData, updateAudioUrl, deleteAudioById } from '../controllers/audios';

const router = Router();

router.get('/', getAudios);

router.post('/', createAudio);

router.patch('/:audioiId', updateAudioTextData);

router.patch('/:audioiId/link', updateAudioUrl);

router.delete('/:audioiId', deleteAudioById);

export default router;
