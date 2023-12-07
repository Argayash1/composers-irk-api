// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Report from '../models/report';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_REPORTID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_REPORT_MESSAGE,
  REPORT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

interface IReport {
  year?: string;
  imageUrl?: string;
  altText?: string;
}

const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalNewsCount = await Report.countDocuments();

    let newsQuery = Report.find();

    if (page && limit) {
      newsQuery = newsQuery.skip(skip).limit(limit);
    }

    const reports = await newsQuery;

    res.send({
      reports,
      totalPages: limit ? Math.ceil(totalNewsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const createReport = async (req: Request, res: Response, next: NextFunction) => {
  const { year, imageUrl, altText } = req.body;
  try {
    const report = await Report.create({ year, imageUrl, altText });
    res.status(CREATED_201).send(report);
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

const updateAudioData = async (req: Request, res: Response, next: NextFunction, newsData: IReport) => {
  try {
    const { reportId } = req.params;
    // обновим имя найденного по _id пользователя
    const report = await Report.findByIdAndUpdate(
      reportId,
      newsData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!report) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(report);
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

const updateReportTextData = (req: Request, res: Response, next: NextFunction) => {
  const { year, imageUrl, altText } = req.body;
  updateAudioData(req, res, next, { year, imageUrl, altText });
};

const updateReportImage = (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl } = req.body;
  updateAudioData(req, res, next, { imageUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) {
      throw new NotFoundError(REPORT_NOT_FOUND_ERROR_MESSAGE);
    }
    await Report.findByIdAndRemove(reportId);
    res.send({ message: DELETE_REPORT_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_REPORTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getReports, createReport, updateReportTextData, updateReportImage, deleteReportById };
