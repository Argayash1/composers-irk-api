import { Router } from 'express'; // импортируем роутер из express

import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProjectById,
  deleteMultipleProjectsByIds,
} from '../controllers/projects';

import {
  projectDataValidator,
  projectQueryParamsValidator,
  projectIdValidator,
} from '../middlwares/validators/projectValidator';

const router = Router();

router.get('/', projectQueryParamsValidator, getProjects);

router.post('/', projectDataValidator, createProject);

router.delete('/', deleteMultipleProjectsByIds);

router.get('/:projectId', projectIdValidator, getProjectById);

router.patch('/:projectId', projectIdValidator, projectDataValidator, updateProject);

router.delete('/:projectId', projectIdValidator, deleteProjectById);

export default router;
