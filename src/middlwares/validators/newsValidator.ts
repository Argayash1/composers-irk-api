import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const newsDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(60),
    newsText: Joi.string().required().min(2),
  }),
});

const newsQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const newsIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    newsId: Joi.string().hex().length(24).required(),
  }),
});

export { newsDataValidator, newsQueryParamsValidator, newsIdValidator };
