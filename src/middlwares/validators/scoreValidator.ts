import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const scoreDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(60),
    url: Joi.string().required(),
    category: Joi.string().required().max(10),
  }),
});

const scoreQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'url', 'composer', 'title', 'category'),
    order: Joi.string().valid('asc', 'desc'),
  }),
});


const scoreIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    scoreId: Joi.string().hex().length(24).required(),
  }),
});

export { scoreDataValidator, scoreQueryParamsValidator, scoreIdValidator };
