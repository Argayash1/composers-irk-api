import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const reportDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    year: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required(),
    altText: Joi.string().required().min(2).max(30),
  }),
});

const reportTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    altText: Joi.string().required().min(2).max(30),
  }),
});

const reportImageUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
  }),
});

const reportIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    reportId: Joi.string().hex().length(24).required(),
  }),
});

export { reportDataValidator, reportTextDataValidator, reportImageUrlValidator, reportIdValidator };
