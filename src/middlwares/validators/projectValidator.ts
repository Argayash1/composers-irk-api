import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const projectDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    title: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2),
  }),
});

const projectQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'imageUrl', 'title', 'description'),
    order: Joi.string().valid('asc', 'desc'),
    title: Joi.string().min(2).max(30),
    description: Joi.string().min(2),
  }),
});

const projectIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    projectId: Joi.string().hex().length(24).required(),
  }),
});

const projectsIdsValidator = celebrate({
  body: Joi.object().keys({
    projectIds: Joi.array()
      .items(Joi.string().hex().length(24)) // Проверяем, что каждый элемент массива является валидным ObjectId
      .required()
  }),
});


export { projectDataValidator, projectQueryParamsValidator, projectIdValidator, projectsIdsValidator };
