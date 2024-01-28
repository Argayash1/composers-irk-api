import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const contactDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    iconUrl: Joi.string(),
    text: Joi.string().required().min(2).max(60),
    altText: Joi.string().required().min(2).max(30),
  }),
});

const contactIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    contactId: Joi.string().hex().length(24).required(),
  }),
});

export { contactDataValidator, contactIdValidator };
