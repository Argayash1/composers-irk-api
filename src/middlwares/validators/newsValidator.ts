import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const newsDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(30),
    newsText: Joi.string().required().min(2),
  }),
});

const newsQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const newsTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    newsText: Joi.string().required().min(2),
  }),
});

const newsImageUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
  }),
});

const newsIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    newsId: Joi.string().hex().length(24).required(),
  }),
});

export { newsDataValidator, newsQueryParamsValidator, newsTextDataValidator, newsImageUrlValidator, newsIdValidator };
