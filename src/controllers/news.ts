// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import News from '../models/news';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_NEWSID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_NEWS_MESSAGE,
  NEWS_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalNewsCount = await News.countDocuments();

    let newsQuery = News.find();

    if (page && limit) {
      newsQuery = newsQuery.skip(skip).limit(limit);
    }

    const news = await newsQuery;

    res.send({
      news,
      totalPages: limit ? Math.ceil(totalNewsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
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
        .join(', ');
      next(new BadRequestError(`${VALIDATION_ERROR_MESSAGE} ${errorMessage}`));
    } else {
      next(err);
    }
  }
};

// Функция, которая удаляет новость по идентификатору
const deleteNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: newsId } = req.params;
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

export { getNews, createNews, deleteNewsById };
