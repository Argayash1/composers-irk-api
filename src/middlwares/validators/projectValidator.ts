import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const projectDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2),
  }),
});

const projectQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const projectTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2),
  }),
});

const projectImageUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
  }),
});

const projectIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    projectId: Joi.string().hex().length(24).required(),
  }),
});

export {
  projectDataValidator,
  projectQueryParamsValidator,
  projectTextDataValidator,
  projectImageUrlValidator,
  projectIdValidator,
};
