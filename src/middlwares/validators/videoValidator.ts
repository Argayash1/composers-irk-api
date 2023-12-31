import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const videoDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    performer: Joi.string().required().min(2).max(30),
    iframeUrl: Joi.string().required(),
  }),
});

const videoQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const videoTextDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    composer: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    performer: Joi.string().required().min(2).max(30),
  }),
});

const videoImageUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    iframeUrl: Joi.string().required(),
  }),
});

const videoIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    videoId: Joi.string().hex().length(24).required(),
  }),
});

export {
  videoDataValidator,
  videoQueryParamsValidator,
  videoTextDataValidator,
  videoImageUrlValidator,
  videoIdValidator,
};
