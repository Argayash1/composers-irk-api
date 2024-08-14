import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт модулей bcryptjs и jsonwebtoken
import bcrypt from 'bcryptjs'; // импортируем bcrypt
import jwt from 'jsonwebtoken'; // импортируем модуль jsonwebtoken

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';

// Импорт модели user
import User from '../models/user'; // импортируем модель user
import { CustomRequest } from '../middlwares/auth';

// Импорт статус-кодов ошибок
const {
  CREATED_201,
  DUPLICATION_11000,
  VALIDATION_ERROR_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
  LOGIN_MESSAGE,
  LOGOUT_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
  CAST_INCORRECT_USERID_ERROR_MESSAGE,
} = require('../utils/constants');

const { ValidationError, CastError } = Error;

// Импорт переменной секретного ключа
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

interface CustomError extends Error {
  code?: string;
}

// Функция, которая возвращает информацию о пользователе (email и имя)
const getCurrentUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: userId } = (req as CustomRequest).user;

    const user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });

    res.status(CREATED_201).send({ data: user });
  } catch (err) {
    if ((err as CustomError).code === DUPLICATION_11000) {
      next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      return;
    }
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

// Функция (контроллер) аутентификации
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    // создадим токен
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, {
      expiresIn: '7d',
    });
    // отправим токен, браузер сохранит его в куках
    res
      .cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true, // указали браузеру посылать куки, только если запрос с того же домена
      })
      .send({ message: LOGIN_MESSAGE });
  } catch (err) {
    next(err);
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true }).send({ message: LOGOUT_MESSAGE });
};

// Функция, которая обновляет данные пользователя
const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { _id: userId } = (req as CustomRequest).user;
  const { email, name } = req.body;

  try {
    // обновим имя найденного по _id пользователя
    const user = await User.findByIdAndUpdate(
      userId,
      { email, name }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE);
    }
    res.send(user);
  } catch (err) {
    if ((err as CustomError).code === DUPLICATION_11000) {
      next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      return;
    }
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      next(new BadRequestError(`${VALIDATION_ERROR_MESSAGE} ${errorMessage}`));
      return;
    }
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_USERID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getCurrentUserInfo, createUser, login, logout, updateUserData };
