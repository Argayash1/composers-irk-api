import { Router } from 'express'; // импортируем роутер из express

import {
  getProjects,
  getProjectById,
  createProject,
  updateProjectTextData,
  updateProjectImage,
  deleteProjectById,
} from '../controllers/projects';

const router = Router();

router.get('/', getProjects);

router.post('/', createProject);

router.get('/:newsId', getProjectById);

router.patch('/:projectId', updateProjectTextData);

router.patch('/:projectId/image', updateProjectImage);

router.delete('/:projectId', deleteProjectById);

export default router;
