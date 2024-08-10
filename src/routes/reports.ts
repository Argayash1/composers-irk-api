import { Router } from "express"; // импортируем роутер из express

import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReportById,
  getReportByIndex,
} from "../controllers/reports";

import {
  reportDataValidator,
  reportIdValidator,
  reportIndexValidator,
} from "../middlwares/validators/reportValidator";

const router = Router();

router.get("/", getReports);

router.post("/", reportDataValidator, createReport);

router.get("/:reportId", reportIdValidator, getReportById);

router.get("/index/:reportIndex", reportIndexValidator, getReportByIndex);

router.patch("/:reportId", reportIdValidator, reportDataValidator, updateReport);

router.delete("/:reportId", reportIdValidator, deleteReportById);

export default router;
