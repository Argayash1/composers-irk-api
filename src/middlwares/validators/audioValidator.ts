import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const audioDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(60),
    title: Joi.string().required().min(2).max(60),
    performer: Joi.string().required().min(2),
    audioUrl: Joi.string(),
  }),
});

const audioQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'audioUrl', 'composer', 'title', 'performer'),
    order: Joi.string().valid('asc', 'desc'),
    composer: Joi.string().min(2).max(60),
    title: Joi.string().min(2).max(60),
    performer: Joi.string().min(2),
  }),
});

const audioIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    audioId: Joi.string().hex().length(24).required(),
  }),
});

const audioIdsValidator = celebrate({
  body: Joi.object().keys({
    audioIds: Joi.array()
      .items(Joi.string().hex().length(24)) // Проверяем, что каждый элемент массива является валидным ObjectId
      .required()
  }),
});


export { audioDataValidator, audioQueryParamsValidator, audioIdsValidator, audioIdValidator };
