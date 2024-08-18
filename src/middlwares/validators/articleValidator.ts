import { celebrate, Joi } from "celebrate";
import { urlRegEx } from "../../utils/constants";

const articleDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(100),
    articleDescription: Joi.string().required().min(2),
    articleText: Joi.string().required().min(2),
    sourceUrl: Joi.string(),
  }),
});

const articleQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'imageUrl', 'createdAt', 'title', 'articleDescription', 'articleText'),
    order: Joi.string().valid('asc', 'desc'),
    title: Joi.string().min(1).max(100),
    articleDescription: Joi.string().min(1),
    articleText: Joi.string().min(1),
  }),
});

const articleIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

const articleIdsValidator = celebrate({
  body: Joi.object().keys({
    articleIds: Joi.array()
      .items(Joi.string().hex().length(24)) // Проверяем, что каждый элемент массива является валидным ObjectId
      .required()
  }),
});


export { articleDataValidator, articleQueryParamsValidator, articleIdValidator, articleIdsValidator };
