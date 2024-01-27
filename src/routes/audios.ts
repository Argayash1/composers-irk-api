import { Router } from 'express'; // импортируем роутер из express

import { getAudios, createAudio, updateAudioTextData, updateAudioUrl, deleteAudioById } from '../controllers/audios';
import {
  audioDataValidator,
  audioTextDataValidator,
  audioUrlValidator,
  audioIdValidator,
} from '../middlwares/validators/audioValidator';

const router = Router();

router.get('/', getAudios);

router.post('/', audioDataValidator, createAudio);

router.patch('/:audioId', audioIdValidator, audioTextDataValidator, updateAudioTextData);

router.patch('/:audioId/link', audioIdValidator, audioUrlValidator, updateAudioUrl);

router.delete('/:audioId', audioIdValidator, deleteAudioById);

export default router;
