// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { CastError } from 'mongoose';
import ValidationError from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import News, { INews } from '../models/news';

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
