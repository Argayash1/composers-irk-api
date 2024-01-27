import { Router } from 'express'; // импортируем роутер из express

import {
  getReports,
  createReport,
  updateReportTextData,
  updateReportImage,
  deleteReportById,
  getReportByIndex,
} from '../controllers/reports';

import {
  reportDataValidator,
  reportTextDataValidator,
  reportImageUrlValidator,
  reportIdValidator,
  reportIndexValidator,
} from '../middlwares/validators/reportValidator';

const router = Router();

router.get('/', getReports);

router.post('/', reportDataValidator, createReport);

router.get('/:reportIndex', reportIndexValidator, getReportByIndex);

router.patch('/:reportId', reportIdValidator, reportTextDataValidator, updateReportTextData);

router.patch('/:reportId/image', reportIdValidator, reportImageUrlValidator, updateReportImage);

router.delete('/:reportId', reportIdValidator, deleteReportById);

export default router;
