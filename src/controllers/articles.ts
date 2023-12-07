// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Article from '../models//article';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_ARTICLE_MESSAGE,
  ARTICLE_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

interface IArticle {
  imageUrl?: string;
  title?: string;
  articleDescription?: string;
  articleText?: string;
  sourceUrl?: string;
}

const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalNewsCount = await Article.countDocuments();

    let newsQuery = Article.find();

    if (page && limit) {
      newsQuery = newsQuery.skip(skip).limit(limit);
    }

    const articles = await newsQuery;

    res.send({
      articles,
      totalPages: limit ? Math.ceil(totalNewsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const news = await Article.findById(articleId);
    res.send(news);
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, createdAt, title, newsText } = req.body;
  try {
    const news = await Article.create({ imageUrl, createdAt, title, newsText });
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

const updateArticleData = async (req: Request, res: Response, next: NextFunction, newsData: IArticle) => {
  try {
    const { articleId } = req.params;
    // обновим имя найденного по _id пользователя
    const news = await Article.findByIdAndUpdate(
      articleId,
      newsData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!news) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(news);
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      return;
    }
    if (err instanceof CastError) {
      next(new BadRequestError('Некорректный Id пользователя'));
    } else {
      next(err);
    }
  }
};

const updateArticleTextData = (req: Request, res: Response, next: NextFunction) => {
  const { title, articleText, articleDescription, sourceUrl } = req.body;
  updateArticleData(req, res, next, { title, articleText, articleDescription, sourceUrl });
};

const updateArticleImage = (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl } = req.body;
  updateArticleData(req, res, next, { imageUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.params;
    const news = await Article.findById(articleId);
    if (!news) {
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

export { getArticles, getArticleById, createArticle, updateArticleTextData, updateArticleImage, deleteArticleById };
