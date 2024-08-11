// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели news и её интерфейса
import News from "../models/news";

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_NEWSID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_NEWS_MESSAGE,
  NEWS_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit
      ? Number(req.query.limit as string)
      : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalNewsCount = await News.countDocuments();

    let newsQuery = News.find();

    if (page && limit) {
      newsQuery = newsQuery.skip(skip).limit(limit);
    }

    const news = await newsQuery;

    res.send({
      data: news,
      totalPages: limit ? Math.ceil(totalNewsCount / limit) : undefined,
      total: totalNewsCount,
    });
  } catch (err) {
    next(err);
  }
};

const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newsId } = req.params;
    const news = await News.findById(newsId);
    res.send({ data: news });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_NEWSID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createNews = async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, createdAt, title, newsText } = req.body;
  try {
    const news = await News.create({ imageUrl, createdAt, title, newsText });
    res.status(CREATED_201).send(news);
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

const updateNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { newsId } = req.params;
    const { title, newsText, imageUrl } = req.body;

    // обновим имя найденного по _id пользователя
    const news = await News.findByIdAndUpdate(
      newsId,
      { title, newsText, imageUrl }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!news) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(news);
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
const deleteNewsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newsId } = req.params;
    const news = await News.findById(newsId);
    if (!news) {
      throw new NotFoundError(NEWS_NOT_FOUND_ERROR_MESSAGE);
    }
    await News.findByIdAndRemove(newsId);
    res.send({ message: DELETE_NEWS_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_NEWSID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getNews, getNewsById, createNews, updateNews, deleteNewsById };
