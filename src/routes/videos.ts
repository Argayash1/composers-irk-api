import { Router } from 'express'; // импортируем роутер из express

import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideoById,
} from '../controllers/videos';

import {
  videoDataValidator,
  videoQueryParamsValidator,
  videoIdValidator,
} from '../middlwares/validators/videoValidator';

const router = Router();

router.get('/', videoQueryParamsValidator, getVideos);

router.post('/', videoDataValidator, createVideo);

router.get('/:videoId', videoIdValidator, getVideoById);

router.patch('/:videoId', videoIdValidator, videoDataValidator, updateVideo);

router.delete('/:videoId', videoIdValidator, deleteVideoById);

export default router;
