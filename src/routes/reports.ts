import { Router } from "express"; // импортируем роутер из express

import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReportById,
  getReportByIndex,
  deleteMultipleReportsByIds,
} from "../controllers/reports";

import {
  reportDataValidator,
  reportIdValidator,
  reportQueryParamsValidator,
  reportIndexValidator,
  reportIdsValidator,
} from "../middlwares/validators/reportValidator";

const router = Router();

router.get("/", reportQueryParamsValidator, getReports);

router.post("/", reportDataValidator, createReport);

router.delete('/', reportIdsValidator, deleteMultipleReportsByIds);

router.get("/:reportId", reportIdValidator, getReportById);

router.get("/index/:reportIndex", reportIndexValidator, getReportByIndex);

router.patch("/:reportId", reportIdValidator, reportDataValidator, updateReport);

router.delete("/:reportId", reportIdValidator, deleteReportById);

export default router;
