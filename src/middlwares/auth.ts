import { Request, Response, NextFunction } from 'express';

import jwt, { Secret } from 'jsonwebtoken';

// Импорт переменной секретного ключа
import { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } from '../utils/config';

import UnauthorizedError from '../errors/UnauthorizedError';

import { UNAUTHORIZED_ERROR_MESSAGE } from '../utils/constants';

export interface CustomRequest extends Request {
  user: any; // замените `any` на тип, который соответствует вашему пользователю
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  // извлечём токен и сохраняем его в переменную
  const token = req.cookies.jwt;

  // убеждаемся, что он есть
  if (!token) {
    return next(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
  }

  let payload;

  try {
    let secretKey: Secret;

    if (NODE_ENV === 'production') {
      secretKey = JWT_SECRET!;
    } else {
      if (JWT_SECRET_DEV) {
        secretKey = JWT_SECRET_DEV;
      } else {
        throw new Error('JWT_SECRET_DEV is undefined');
      }
    }

    payload = jwt.verify(token, secretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
  }
  (req as CustomRequest).user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

export default auth;
