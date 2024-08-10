import { Router } from "express"; // импортируем роутер из express

import {
  getAudios,
  getAudioById,
  createAudio,
  updateAudioData,
  deleteAudioById,
} from "../controllers/audios";
import {
  audioDataValidator,
  audioIdValidator,
} from "../middlwares/validators/audioValidator";

const router = Router();

router.get("/", getAudios);

router.post("/", audioDataValidator, createAudio);

router.get("/:audioId", audioIdValidator, getAudioById);

router.patch(
  "/:audioId",
  audioIdValidator,
  audioDataValidator,
  updateAudioData
);

router.delete("/:audioId", audioIdValidator, deleteAudioById);

export default router;
