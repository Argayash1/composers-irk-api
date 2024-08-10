// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт классов ошибок из mongoose.Error
import { Error } from "mongoose";

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from "../errors/NotFoundError"; // импортируем класс ошибок NotFoundError
import BadRequestError from "../errors/BadRequestError";

// Импорт модели member и её интерфейса
import Member from "../models/member";

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_MEMBERID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_PROJECT_MESSAGE,
  PROJECT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "../utils/constants";

const { ValidationError, CastError } = Error;

interface IMember {
  imageUrl?: string;
  surname?: string;
  patronymic?: string;
  name?: string;
  profession?: string;
  biography?: string;
  shortBiography?: string;
  works?: string;
  competitions?: string;
  awards?: string;
  links?: string;
}

// Функция, которая возвращает все новости
const getUnionMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit
      ? Number(req.query.limit as string)
      : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalMembersCount = await Member.countDocuments();

    let membersQuery = Member.find().sort({ surname: 1 });

    if (page && limit) {
      membersQuery = membersQuery.skip(skip).limit(limit);
    }

    const members = await membersQuery;

    res.send({
      data: members,
      totalPages: limit ? Math.ceil(totalMembersCount / limit) : undefined,
      total: totalMembersCount,
    });
  } catch (err) {
    next(err);
  }
};

const getUnionMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId);
    res.send({ data: member });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_MEMBERID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createUnionMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    imageUrl,
    surname,
    patronymic,
    name,
    profession,
    biography,
    shortBiography,
    works,
    competitions,
    awards,
    links,
  } = req.body;
  try {
    const members = await Member.create({
      imageUrl,
      surname,
      patronymic,
      name,
      profession,
      biography,
      shortBiography,
      works,
      awards,
      competitions,
      links,
    });
    res.status(CREATED_201).send(members);
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

const updateUnionMemberData = async (
  req: Request,
  res: Response,
  next: NextFunction,
  memberData: IMember
) => {
  try {
    const { memberId } = req.params;
    // обновим имя найденного по _id пользователя
    const news = await Member.findByIdAndUpdate(
      memberId,
      memberData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    if (!news) {
      throw new NotFoundError("Такого пользователя нет");
    }

    res.send(news);
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

const updateUnionMemberProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { surname, patronymic, name, profession } = req.body;
  updateUnionMemberData(req, res, next, {
    surname,
    patronymic,
    name,
    profession,
  });
};

const updateUnionMemberAbout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { biography, shortBiography, works, awards, competitions, links } =
    req.body;
  updateUnionMemberData(req, res, next, {
    biography,
    shortBiography,
    works,
    awards,
    competitions,
    links,
  });
};

const updateUnionMemberImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { imageUrl } = req.body;
  updateUnionMemberData(req, res, next, { imageUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteUnionMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId } = req.params;
    const news = await Member.findById(memberId);
    if (!news) {
      throw new NotFoundError(PROJECT_NOT_FOUND_ERROR_MESSAGE);
    }
    await Member.findByIdAndRemove(memberId);
    res.send({ message: DELETE_PROJECT_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_MEMBERID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export {
  getUnionMembers,
  getUnionMemberById,
  updateUnionMemberProfile,
  updateUnionMemberAbout,
  updateUnionMemberImage,
  createUnionMember,
  deleteUnionMemberById,
};
