import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const audioDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(60),
    performer: Joi.string().required().min(2),
    audioUrl: Joi.string(),
  }),
});

const audioTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(60),
    performer: Joi.string().required().min(2),
  }),
});

const audioUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    audioUrl: Joi.string().required(),
  }),
});

const audioIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    audioId: Joi.string().hex().length(24).required(),
  }),
});

export { audioDataValidator, audioTextDataValidator, audioUrlValidator, audioIdValidator };
