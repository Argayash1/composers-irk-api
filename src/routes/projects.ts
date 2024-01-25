import { Router } from 'express'; // импортируем роутер из express

import {
  getProjects,
  getProjectById,
  createProject,
  updateProjectTextData,
  updateProjectImage,
  deleteProjectById,
} from '../controllers/projects';

import {
  projectDataValidator,
  projectQueryParamsValidator,
  projectTextDataValidator,
  projectImageUrlValidator,
  projectIdValidator,
} from '../middlwares/validators/projectValidator';

const router = Router();

router.get('/', projectQueryParamsValidator, getProjects);

router.post('/', projectDataValidator, createProject);

router.get('/:projectId', projectIdValidator, getProjectById);

router.patch('/:projectId', projectIdValidator, projectTextDataValidator, updateProjectTextData);

router.patch('/:projectId/image', projectIdValidator, projectImageUrlValidator, updateProjectImage);

router.delete('/:projectId', projectIdValidator, deleteProjectById);

export default router;
