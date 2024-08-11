import { Router } from "express"; // импортируем роутер из express

import {
  getScores,
  getScoreById,
  createScore,
  updateScore,
  deleteScoreById,
} from "../controllers/scores";

import { scoreDataValidator, scoreIdValidator } from "../middlwares/validators/scoreValidator";

const router = Router();

router.get("/", getScores);

router.post("/", scoreDataValidator, createScore);

router.get("/:scoreId", scoreIdValidator, getScoreById);

router.patch("/:scoreId", scoreIdValidator, scoreDataValidator, updateScore);

router.delete("/:scoreId", scoreIdValidator, deleteScoreById);

export default router;
