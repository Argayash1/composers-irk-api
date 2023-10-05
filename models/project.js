const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');
const { dateRegEx } = require('../utils/constants');

const projectSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на изображение для проекта'],
      validate: {
        validator: (url) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на изображение для проекта',
      },
    },
    date: {
      type: String,
      required: [true, 'не передана дата создания проекта'],
      validate: {
        validator: (date) => dateRegEx.test(date),
        message: 'дата должна быть в формате 01.01.2023',
      },
    },
    title: {
      type: String,
      required: [true, 'не передано название проекта'],
      minlength: [2, 'длина названия проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина названия проекта должна быть не более 60 символов'],
    },
    description: {
      type: String,
      required: [true, 'не передано описание проекта'],
      minlength: [2, 'длина описания проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина описания проекта должна быть не более 60 символов'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('project', projectSchema);
