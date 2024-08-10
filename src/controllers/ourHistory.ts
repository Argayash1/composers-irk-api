// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели history и её интерфейса
import History from "../models/history";

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_AUDIOID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_AUDIO_MESSAGE,
  AUDIO_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

const getOurHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ourHistory = await History.find({});
    const totalOurHistoryCount = await History.countDocuments({});

    res.send({
      data: ourHistory,
      totalPages: totalOurHistoryCount ? 1 : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const createOurHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { author, text } = req.body;
  try {
    const ourHistory = await History.create({ author, text });
    res.status(CREATED_201).send(ourHistory);
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

const updateOurHistoryData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { historyId } = req.params;
    const { text, author } = req.body;
    // обновим имя найденного по _id пользователя
    const ourHistory = await History.findByIdAndUpdate(
      historyId,
      { text, author }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!ourHistory) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(ourHistory);
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

// Функция, которая удаляет новость по идентификатору
const deleteOurHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { historyId } = req.params;
    const ourHistory = await History.findById(historyId);
    if (!ourHistory) {
      throw new NotFoundError(AUDIO_NOT_FOUND_ERROR_MESSAGE);
    }
    await History.findByIdAndRemove(historyId);
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
  getOurHistory,
  createOurHistory,
  updateOurHistoryData,
  deleteOurHistoryById,
};
