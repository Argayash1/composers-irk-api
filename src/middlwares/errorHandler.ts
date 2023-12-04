import { INTERNAL_SERVER_ERROR_500, SERVER_ERROR_MESSAGE } from '../utils/constants';
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

// Миддлвэр для централизованной обработки ошибок
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === INTERNAL_SERVER_ERROR_500 ? SERVER_ERROR_MESSAGE : message,
  });
  next();
};

export default errorHandler;
