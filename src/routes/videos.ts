import { Router } from 'express'; // импортируем роутер из express

import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideoTextData,
  updateVideoUrl,
  deleteVideoById,
} from '../controllers/videos';

const router = Router();

router.get('/', getVideos);

router.post('/', createVideo);

router.get('/:videoId', getVideoById);

router.patch('/:videoId', updateVideoTextData);

router.patch('/:videoId/link', updateVideoUrl);

router.delete('/:videoId', deleteVideoById);

export default router;
