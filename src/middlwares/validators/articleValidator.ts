import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const articleDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(100),
    articleDescription: Joi.string().required().min(2),
    articleText: Joi.string().required().min(2),
    sourceUrl: Joi.string(),
  }),
});

const articleQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const articleTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    articleText: Joi.string().required().min(2),
    articleDescription: Joi.string().required().min(2),
    sourceUrl: Joi.string(),
  }),
});

const articleImageUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
  }),
});

const articleIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

export {
  articleDataValidator,
  articleQueryParamsValidator,
  articleTextDataValidator,
  articleImageUrlValidator,
  articleIdValidator,
};
