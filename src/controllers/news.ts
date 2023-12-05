// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { CastError } from 'mongoose';
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import News from '../models/news';

// Импорт статус-кодов ошибок
import { CREATED_201, VALIDATION_ERROR_MESSAGE } from '../utils/constants';

// Функция, которая возвращает все новости
const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.find();
    res.send(news);
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
    if (err instanceof Error.ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      next(new BadRequestError(`${VALIDATION_ERROR_MESSAGE} ${errorMessage}`));
    } else {
      next(err);
    }
  }
};

export { getNews, createNews };
