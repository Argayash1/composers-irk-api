import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const scoreDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(60),
    url: Joi.string().required(),
    category: Joi.number().required().max(10),
  }),
});

const scoreTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(60),
    category: Joi.number().required().max(10),
  }),
});

const scoreUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    url: Joi.string().required(),
  }),
});

const scoreIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    scoreId: Joi.string().hex().length(24).required(),
  }),
});

export { scoreDataValidator, scoreTextDataValidator, scoreUrlValidator, scoreIdValidator };
