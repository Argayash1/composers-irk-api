// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели news и её интерфейса
import Video from "../models/video";

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_VIDEOID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_VIDEO_MESSAGE,
  VIDEO_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

interface IVideo {
  composer?: string;
  title?: string;
  performer?: string;
  iframeUrl?: string;
  about?: string;
}

const getVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit
      ? Number(req.query.limit as string)
      : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalVideosCount = await Video.countDocuments();

    let videosQuery = Video.find();

    if (page && limit) {
      videosQuery = videosQuery.skip(skip).limit(limit);
    }

    const videos = await videosQuery;

    res.send({
      data: videos,
      totalPages: limit ? Math.ceil(totalVideosCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getVideoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { videoId } = req.params;
    const videos = await Video.findById(videoId);
    res.send({ data: videos });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_VIDEOID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  const { composer, title, performer, iframeUrl, about } = req.body;
  try {
    const video = await Video.create({
      composer,
      title,
      performer,
      iframeUrl,
      about,
    });
    res.status(CREATED_201).send(video);
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

const updateVideoData = async (
  req: Request,
  res: Response,
  next: NextFunction,
  newsData: IVideo
) => {
  try {
    const { videoId } = req.params;
    // обновим имя найденного по _id пользователя
    const video = await Video.findByIdAndUpdate(
      videoId,
      newsData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!video) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(video);
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

const updateVideoTextData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { composer, title, performer, about } = req.body;
  updateVideoData(req, res, next, { composer, title, performer });
};

const updateVideoUrl = (req: Request, res: Response, next: NextFunction) => {
  const { iframeUrl } = req.body;
  updateVideoData(req, res, next, { iframeUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteVideoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      throw new NotFoundError(VIDEO_NOT_FOUND_ERROR_MESSAGE);
    }
    await Video.findByIdAndRemove(videoId);
    res.send({ message: DELETE_VIDEO_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_VIDEOID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export {
  getVideos,
  getVideoById,
  createVideo,
  updateVideoTextData,
  updateVideoUrl,
  deleteVideoById,
};
