// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Project from '../models/project';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_PROJECTID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_PROJECT_MESSAGE,
  PROJECT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

// Функция, которая возвращает все новости
const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await Project.find();
    res.send(news);
  } catch (err) {
    next(err);
  }
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, title, description } = req.body;
  try {
    const news = await Project.create({ imageUrl, title, description });
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

// Функция, которая удаляет новость по идентификатору
const deleteNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: projectId } = req.params;
    const news = await Project.findById(projectId);
    if (!news) {
      throw new NotFoundError(PROJECT_NOT_FOUND_ERROR_MESSAGE);
    }
    await Project.findByIdAndRemove(projectId);
    res.send({ message: DELETE_PROJECT_MESSAGE });
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new BadRequestError(CAST_INCORRECT_PROJECTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getProjects, createProject, deleteNewsById };
