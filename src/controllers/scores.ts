// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Score from '../models/score';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_SCOREID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_SCORE_MESSAGE,
  SCORE_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

interface IAudio {
  composer?: string;
  title?: string;
  performer?: string;
  audioUrl?: string;
}

const getScores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalNewsCount = await Score.countDocuments();

    let newsQuery = Score.find();

    if (page && limit) {
      newsQuery = newsQuery.skip(skip).limit(limit);
    }

    const scores = await newsQuery;

    res.send({
      scores,
      totalPages: limit ? Math.ceil(totalNewsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const createScore = async (req: Request, res: Response, next: NextFunction) => {
  const { composer, title, performer, audioUrl } = req.body;
  try {
    const news = await Score.create({ composer, title, performer, audioUrl });
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

const updateScoreData = async (req: Request, res: Response, next: NextFunction, newsData: IAudio) => {
  try {
    const { scoreId } = req.params;
    // обновим имя найденного по _id пользователя
    const score = await Score.findByIdAndUpdate(
      scoreId,
      newsData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!score) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(score);
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

const updateScoreTextData = (req: Request, res: Response, next: NextFunction) => {
  const { title, composer, performer } = req.body;
  updateScoreData(req, res, next, { title, composer, performer });
};

const updateScoreUrl = (req: Request, res: Response, next: NextFunction) => {
  const { audioUrl } = req.body;
  updateScoreData(req, res, next, { audioUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteScoreById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scoreId } = req.params;
    const score = await Score.findById(scoreId);
    if (!score) {
      throw new NotFoundError(SCORE_NOT_FOUND_ERROR_MESSAGE);
    }
    await Score.findByIdAndRemove(scoreId);
    res.send({ message: DELETE_SCORE_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_SCOREID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getScores, createScore, updateScoreTextData, updateScoreUrl, deleteScoreById };
