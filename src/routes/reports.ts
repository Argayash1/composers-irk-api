import { Router } from 'express'; // импортируем роутер из express

import {
  getReports,
  createReport,
  updateReportTextData,
  updateReportImage,
  deleteReportById,
} from '../controllers/reports';

const router = Router();

router.get('/', getReports);

router.post('/', createReport);

router.patch('/:reportId', updateReportTextData);

router.patch('/:reportId/image', updateReportImage);

router.delete('/:reportId', deleteReportById);

export default router;
