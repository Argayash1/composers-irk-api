const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');
const { dateRegEx } = require('../utils/constants');

const newsSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на изображение для новости'],
      validate: {
        validator: (url) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на изображение для новости',
      },
    },
    date: {
      type: String,
      required: [true, 'не передана дата создания новости'],
      validate: {
        validator: (date) => dateRegEx.test(date),
        message: 'дата должна быть в формате 01.01.2023',
      },
    },
    title: {
      type: String,
      required: [true, 'не передан заголовок новости'],
      minlength: [2, 'длина заголовка новости должна быть не менее 2 символов'],
      maxlength: [30, 'длина заголовка новости должна быть не более 60 символов'],
    },
    newsText: {
      type: String,
      required: [true, 'не передан заголовок новости'],
      minlength: [2, 'длина текста новости должна быть не менее 2 символов'],
      maxlength: [30, 'длина текста новости должна быть не более 60 символов'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', newsSchema);
