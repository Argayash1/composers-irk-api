import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const newsDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(60),
    newsText: Joi.string().required().min(2),
  }),
});

const newsQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'imageUrl', 'createdAt', 'title', 'newsText'),
    order: Joi.string().valid('asc', 'desc'),
    title: Joi.string().min(1).max(60),
    newsText: Joi.string().min(2)
  }),
});

const newsIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    newsId: Joi.string().hex().length(24).required(),
  }),
});

const newsIdsValidator = celebrate({
  body: Joi.object().keys({
    newsIds: Joi.array()
      .items(Joi.string().hex().length(24)) // Проверяем, что каждый элемент массива является валидным ObjectId
      .required()
  }),
});


export { newsDataValidator, newsQueryParamsValidator, newsIdValidator, newsIdsValidator };
