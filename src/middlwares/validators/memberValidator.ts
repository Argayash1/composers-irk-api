import { celebrate, Joi } from "celebrate";
import { urlRegEx } from "../../utils/constants";

const memberDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    surname: Joi.string().required().min(2).max(30),
    patronymic: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    profession: Joi.string().required().min(2).max(30),
    biography: Joi.string().required().min(2),
    shortBiography: Joi.string().required().min(2),
    works: Joi.string().required().min(2),
    competitions: Joi.string().min(2),
    awards: Joi.string().min(2),
    links: Joi.string().min(2),
  }),
});

const memberQueryParamsValidator = celebrate({
  // валидируем query-параметры
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'imageUrl', 'surname', 'patronymic', 'name', 'profession', 'biography', 'shortBiography', 'works', 'competitions', 'awards'),
    order: Joi.string().valid('asc', 'desc'),
    surname: Joi.string().min(2).max(30),
    patronymic: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
    profession: Joi.string().min(2).max(30),
  }),
});

const memberIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    memberId: Joi.string().hex().length(24).required(),
  }),
});

export {
  memberDataValidator,
  memberQueryParamsValidator,
  memberIdValidator,
};
