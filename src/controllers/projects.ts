// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели project и её интерфейса
import Project from "../models/project";

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_PROJECTID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_PROJECT_MESSAGE,
  PROJECT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

// Функция, которая возвращает все новости
const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;
    const sortBy = req.query.sortBy ? req.query.sortBy as string : undefined;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;


    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalProjectsCount = await Project.countDocuments();

    let projectsQuery = Project.find();

    if (sortBy) {
      projectsQuery = projectsQuery.sort({ [sortBy]: sortOrder });
    }

    if (page && limit) {
      projectsQuery = projectsQuery.skip(skip).limit(limit);
    }

    const projects = await projectsQuery;

    res.send({
      data: projects,
      totalPages: limit ? Math.ceil(totalProjectsCount / limit) : undefined,
      total: totalProjectsCount,
    });
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const projects = await Project.findById(projectId);
    res.send({ data: projects });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_PROJECTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, title, description } = req.body;
  try {
    const news = await Project.create({ imageUrl, title, description });
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

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { title, description, imageUrl } = req.body;

    // обновим имя найденного по _id пользователя
    const project = await Project.findByIdAndUpdate(
      projectId,
      { title, description, imageUrl }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!project) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(project);
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
const deleteProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const news = await Project.findById(projectId);
    if (!news) {
      throw new NotFoundError(PROJECT_NOT_FOUND_ERROR_MESSAGE);
    }
    await Project.findByIdAndRemove(projectId);
    res.send({ message: DELETE_PROJECT_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_PROJECTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getProjects, getProjectById, updateProject, createProject, deleteProjectById };
