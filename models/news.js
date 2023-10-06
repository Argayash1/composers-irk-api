const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');

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
    createdAt: {
      type: Date,
      default: Date.now,
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
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', newsSchema);
