// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error, Types } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели article и её интерфейса
import Article from "../models//article";

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_ARTICLE_MESSAGE,
  ARTICLE_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

const getArticles = async (req: Request, res: Response, next: NextFunction) => {
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

    const totalArticlesCount = await Article.countDocuments(filters);

    let articlesQuery = Article.find(filters);

    if (sortBy) {
      articlesQuery = articlesQuery.sort({ [sortBy]: order });
    }

    if (page && limit) {
      articlesQuery = articlesQuery.skip(skip).limit(limit);
    }

    const articles = await articlesQuery;

    res.send({
      data: articles,
      totalPages: limit ? Math.ceil(totalArticlesCount / limit) : undefined,
      total: totalArticlesCount,
    });
  } catch (err) {
    next(err);
  }
};

const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const articles = await Article.findById(articleId);
    res.send({ data: articles });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    imageUrl,
    createdAt,
    title,
    articleText,
    articleDescription,
    sourceUrl,
  } = req.body;
  try {
    const news = await Article.create({
      imageUrl,
      createdAt,
      title,
      articleText,
      articleDescription,
      sourceUrl,
    });
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

const updateArticleData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const { title, articleText, articleDescription, imageUrl, sourceUrl } =
      req.body;

    // обновим имя найденного по _id пользователя
    const article = await Article.findByIdAndUpdate(
      articleId,
      { title, articleText, articleDescription, imageUrl, sourceUrl }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!article) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(article);
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

// Функция, которая удаляет статью по идентификатору
const deleteArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) {
      throw new NotFoundError(ARTICLE_NOT_FOUND_ERROR_MESSAGE);
    }
    await Article.findByIdAndRemove(articleId);
    res.send({ message: DELETE_ARTICLE_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

// Функция, которая удаляет несколько статей по идентификаторам
const deleteMultipleArticlesByIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleIds } = req.body; // Предполагаем, что идентификаторы передаются в теле запроса как массив
    if (!Array.isArray(articleIds) || articleIds.length === 0) {
      throw new BadRequestError("Массив Id статей не является массивом или не содержит элементов.");
    }

    const validNewsIds = articleIds.map(id => new Types.ObjectId(id)); // Преобразуем строки в ObjectId

    // Проверяем, какие новости существуют
    const existingNews = await Article.find({ _id: { $in: validNewsIds } });
    if (existingNews.length !== validNewsIds.length) {
      throw new NotFoundError("Некоторые из статей не найдены.");
    }

    // Удаляем новости
    await Article.deleteMany({ _id: { $in: validNewsIds } });
    res.send({ message: "Статьи успешно удалены" });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError("Некоторые из Id статей некорректны"));
    } else {
      next(err);
    }
  }
};


export {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleData,
  deleteArticleById,
  deleteMultipleArticlesByIds
};
