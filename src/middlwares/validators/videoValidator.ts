import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const videoDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(100),
    performer: Joi.string().min(2).max(30),
    iframeUrl: Joi.string().required(),
    about: Joi.string().min(2),
  }),
});

const videoQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'iframeUrl', 'composer', 'title', 'about', 'createdAt'),
    order: Joi.string().valid('asc', 'desc'),
    composer: Joi.string().min(2).max(30),
    title: Joi.string().min(2).max(100),
  }),
});

const videoIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    videoId: Joi.string().hex().length(24).required(),
  }),
});

const videoIdsValidator = celebrate({
  body: Joi.object().keys({
    videoIds: Joi.array()
      .items(Joi.string().hex().length(24)) // Проверяем, что каждый элемент массива является валидным ObjectId
      .required()
  }),
});

export { videoDataValidator, videoQueryParamsValidator, videoIdValidator, videoIdsValidator };
