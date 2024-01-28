import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const ourHistoryDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    text: Joi.string().required().min(2),
    author: Joi.string().min(2).max(60),
  }),
});

const ourHistoryIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    historyId: Joi.string().hex().length(24).required(),
  }),
});

export { ourHistoryDataValidator, ourHistoryIdValidator };
