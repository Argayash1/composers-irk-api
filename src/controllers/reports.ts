// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели report и её интерфейса
import Report from "../models/report";

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  BAD_REUEST_INCORRECT_REPORTINDEX_ERROR_MESSAGE,
  CAST_INCORRECT_REPORTID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_REPORT_MESSAGE,
  REPORT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;
    const sortBy = req.query.sortBy ? req.query.sortBy as string : undefined;
    const order = req.query.sortOrder === 'desc' ? -1 : 1;


    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalReportsCount = await Report.countDocuments();

    let reportsQuery = Report.find();

    if (sortBy) {
      reportsQuery = reportsQuery.sort({ [sortBy]: order });
    }

    if (page && limit) {
      reportsQuery = reportsQuery.skip(skip).limit(limit);
    }

    const reports = await reportsQuery;

    res.send({
      data: reports,
      totalPages: limit ? Math.ceil(totalReportsCount / limit) : undefined,
      total: totalReportsCount,
    });
  } catch (err) {
    next(err);
  }
};

const getReportByIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find({});
    const reportIndex = parseInt(req.params.reportIndex); // Извлечение reportIndex из URL-адреса и преобразование в число

    if (isNaN(reportIndex) || reportIndex >= reports.length) {
      // Проверка валидности reportIndex
      throw new BadRequestError(BAD_REUEST_INCORRECT_REPORTINDEX_ERROR_MESSAGE);
    }

    const report = reports[reportIndex]; // Получение отчёта из массива по индексу

    res.send(report);
  } catch (err) {
    next(err);
  }
};

const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    res.send({ data: report });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_REPORTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createReport = async (req: Request, res: Response, next: NextFunction) => {
  const { year, imageUrl } = req.body;

  try {
    const report = await Report.create({ year, imageUrl });
    res.status(CREATED_201).send(report);
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

const updateReport = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    const { reportId } = req.params;
    const { year, imageUrl } = req.body;

    // обновим имя найденного по _id пользователя
    const report = await Report.findByIdAndUpdate(
      reportId,
      { year, imageUrl }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!report) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(report);
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

export {
  getReports,
  getReportByIndex,
  getReportById,
  createReport,
  updateReport,
  deleteReportById,
};
