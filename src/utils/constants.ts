import { constants as httpConstants } from 'http2';

const {
  HTTP_STATUS_CREATED: CREATED_201,
  HTTP_STATUS_BAD_REQUEST: BAD_REQUEST_400,
  HTTP_STATUS_UNAUTHORIZED: UNAUTHORIZED_401,
  HTTP_STATUS_FORBIDDEN: FORBIDDEN_403,
  HTTP_STATUS_NOT_FOUND: NOT_FOUND_404,
  HTTP_STATUS_CONFLICT: CONFLICT_409,
  HTTP_STATUS_INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR_500,
} = httpConstants;

const SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';
const VALIDATION_ERROR_MESSAGE = 'Некорректные данные:';
const NOT_FOUND_ERROR_MESSAGE = 'Ресурс не найден. Проверьте URL и метод запроса';

const NEWS_NOT_FOUND_ERROR_MESSAGE = 'Такой новости нет';
const DELETE_NEWS_MESSAGE = 'Новость удалена';
const CAST_INCORRECT_NEWSID_ERROR_MESSAGE = 'Некорректный Id нововсти';

const PROJECT_NOT_FOUND_ERROR_MESSAGE = 'Такого проекта нет';
const DELETE_PROJECT_MESSAGE = 'Проект удалён';
const CAST_INCORRECT_PROJECTID_ERROR_MESSAGE = 'Некорректный Id проекта';

const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.\d{4}$/;

export {
  CREATED_201,
  BAD_REQUEST_400,
  UNAUTHORIZED_401,
  FORBIDDEN_403,
  NOT_FOUND_404,
  CONFLICT_409,
  INTERNAL_SERVER_ERROR_500,
  SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  NEWS_NOT_FOUND_ERROR_MESSAGE,
  DELETE_NEWS_MESSAGE,
  CAST_INCORRECT_NEWSID_ERROR_MESSAGE,
  PROJECT_NOT_FOUND_ERROR_MESSAGE,
  DELETE_PROJECT_MESSAGE,
  CAST_INCORRECT_PROJECTID_ERROR_MESSAGE,
  dateRegex,
};
