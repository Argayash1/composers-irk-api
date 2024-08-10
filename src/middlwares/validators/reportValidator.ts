import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const reportDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    year: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required(),
  }),
});

const reportIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    reportId: Joi.string().hex().length(24).required(),
  }),
});

const reportIndexValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    reportIndex: Joi.string().max(2).required(),
  }),
});

export { reportDataValidator, reportIdValidator, reportIndexValidator };
