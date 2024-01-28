// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Contact from '../models/contact';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_AUDIOID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_AUDIO_MESSAGE,
  AUDIO_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await Contact.find({});
    res.send(contacts);
  } catch (err) {
    next(err);
  }
};

const createContact = async (req: Request, res: Response, next: NextFunction) => {
  const { iconUrl, text, altText } = req.body;
  try {
    const contact = await Contact.create({ iconUrl, text, altText });
    res.status(CREATED_201).send(contact);
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

const updateContactData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contactId } = req.params;
    const { iconUrl, text, altText } = req.body;
    // обновим имя найденного по _id пользователя
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { iconUrl, text, altText }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!contact) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(contact);
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

// Функция, которая удаляет новость по идентификатору
const deleteContactById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFoundError(AUDIO_NOT_FOUND_ERROR_MESSAGE);
    }
    await Contact.findByIdAndRemove(contactId);
    res.send({ message: DELETE_AUDIO_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_AUDIOID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getContacts, createContact, updateContactData, deleteContactById };
