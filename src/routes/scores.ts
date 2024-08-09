import { Router } from "express"; // импортируем роутер из express

import {
  getScores,
  getScoreById,
  createScore,
  updateScoreTextData,
  updateScoreUrl,
  deleteScoreById,
} from "../controllers/scores";

import {
  scoreDataValidator,
  scoreTextDataValidator,
  scoreUrlValidator,
  scoreIdValidator,
} from "../middlwares/validators/scoreValidator";

const router = Router();

router.get("/", getScores);

router.post("/", scoreDataValidator, createScore);

router.get("/:scoreId", scoreIdValidator, getScoreById);

router.patch(
  "/:scoreId",
  scoreIdValidator,
  scoreTextDataValidator,
  updateScoreTextData
);

router.patch(
  "/:scoreId/link",
  scoreIdValidator,
  scoreUrlValidator,
  updateScoreUrl
);

router.delete("/:scoreId", scoreIdValidator, deleteScoreById);

export default router;
