// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели news и её интерфейса
import Audio from "../models/audio";

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_AUDIOID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_AUDIO_MESSAGE,
  AUDIO_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

interface IAudio {
  composer?: string;
  title?: string;
  performer?: string;
  audioUrl?: string;
}

const getAudios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit
      ? Number(req.query.limit as string)
      : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalAudiosCount = await Audio.countDocuments();

    let audiosQuery = Audio.find();

    if (page && limit) {
      audiosQuery = audiosQuery.skip(skip).limit(limit);
    }

    const audios = await audiosQuery;

    res.send({
      data: audios,
      totalPages: limit ? Math.ceil(totalAudiosCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getAudioById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { audioId } = req.params;
    const audio = await Audio.findById(audioId);
    res.send({ data: audio });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_AUDIOID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createAudio = async (req: Request, res: Response, next: NextFunction) => {
  const { composer, title, performer, audioUrl } = req.body;
  try {
    const audio = await Audio.create({ composer, title, performer, audioUrl });
    res.status(CREATED_201).send(audio);
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(", ");
      next(new BadRequestError(`${VALIDATION_ERROR_MESSAGE} ${errorMessage}`));
    } else {
      next(err);
    }
  }
};

const updateAudioData = async (
  req: Request,
  res: Response,
  next: NextFunction,
  newsData: IAudio
) => {
  try {
    const { audioId } = req.params;
    // обновим имя найденного по _id пользователя
    const audio = await Audio.findByIdAndUpdate(
      audioId,
      newsData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!audio) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(audio);
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(", ");
      next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      return;
    }
    if (err instanceof CastError) {
      next(new BadRequestError("Некорректный Id пользователя"));
    } else {
      next(err);
    }
  }
};

const updateAudioTextData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, composer, performer } = req.body;
  updateAudioData(req, res, next, { title, composer, performer });
};

const updateAudioUrl = (req: Request, res: Response, next: NextFunction) => {
  const { audioUrl } = req.body;
  updateAudioData(req, res, next, { audioUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteAudioById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { audioId } = req.params;
    const audio = await Audio.findById(audioId);
    if (!audio) {
      throw new NotFoundError(AUDIO_NOT_FOUND_ERROR_MESSAGE);
    }
    await Audio.findByIdAndRemove(audioId);
    res.send({ message: DELETE_AUDIO_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_AUDIOID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export {
  getAudios,
  getAudioById,
  createAudio,
  updateAudioTextData,
  updateAudioUrl,
  deleteAudioById,
};
