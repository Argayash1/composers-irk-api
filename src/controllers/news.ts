// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error, Types } from "mongoose";

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
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;
    const sortBy = req.query.sortBy ? req.query.sortBy as string : undefined;
    const order = req.query.order === 'desc' ? -1 : 1;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const filters: any = {};

    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'order') {
        filters[key] = { $regex: value as string, $options: 'i' };
      }
    }

    const totalNewsCount = await News.countDocuments(filters);

    let newsQuery = News.find(filters);

    if (sortBy) {
      newsQuery = newsQuery.sort({ [sortBy]: order });
    }

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

const updateNews = async (req: Request, res: Response, next: NextFunction,) => {
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
const deleteNewsById = async (req: Request, res: Response, next: NextFunction) => {
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

// Функция, которая удаляет несколько новостей по идентификаторам
const deleteMultipleNewsByIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newsIds } = req.body; // Предполагаем, что идентификаторы передаются в теле запроса как массив
    if (!Array.isArray(newsIds) || newsIds.length === 0) {
      throw new BadRequestError("Массив Id новостей не является массивом или не содержит элементов.");
    }

    const validNewsIds = newsIds.map(id => new Types.ObjectId(id)); // Преобразуем строки в ObjectId

    // Проверяем, какие новости существуют
    const existingNews = await News.find({ _id: { $in: validNewsIds } });
    if (existingNews.length !== validNewsIds.length) {
      throw new NotFoundError("Некоторые из новостей не найдены.");
    }

    // Удаляем новости
    await News.deleteMany({ _id: { $in: validNewsIds } });
    res.send({ message: "Новости успешно удалены" });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError("Некоторые из Id новостей некорректны"));
    } else {
      next(err);
    }
  }
};

export { getNews, getNewsById, createNews, updateNews, deleteNewsById, deleteMultipleNewsByIds };
