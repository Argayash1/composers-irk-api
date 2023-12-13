import { Router } from 'express'; // импортируем роутер из express

import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideoTextData,
  updateVideoUrl,
  deleteVideoById,
} from '../controllers/videos';

import {
  videoDataValidator,
  videoQueryParamsValidator,
  videoTextDataValidator,
  videoImageUrlValidator,
  videoIdValidator,
} from '../middlwares/validators/videoValidator';

const router = Router();

router.get('/', videoQueryParamsValidator, getVideos);

router.post('/', videoDataValidator, createVideo);

router.get('/:videoId', videoIdValidator, getVideoById);

router.patch('/:videoId', videoIdValidator, videoTextDataValidator, updateVideoTextData);

router.patch('/:videoId/link', videoIdValidator, videoImageUrlValidator, updateVideoUrl);

router.delete('/:videoId', videoIdValidator, deleteVideoById);

export default router;
