const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на изображение для статьи'],
      validate: {
        validator: (url) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на изображение для статьи',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, 'не передан заголовок статьи'],
      minlength: [2, 'длина заголовка статьи должна быть не менее 2 символов'],
      maxlength: [30, 'длина заголовка статьи должна быть не более 60 символов'],
    },
    description: {
      type: String,
      required: [true, 'не передано описание статьи'],
      minlength: [2, 'длина описания статьи должна быть не менее 2 символов'],
      maxlength: [60, 'длина описания статьи должна быть не более 60 символов'],
    },
    articleText: {
      type: String,
      required: [true, 'не передан заголовок статьи'],
      minlength: [2, 'длина текста статьи должна быть не менее 2 символов'],
    },
    sourceUrl: {
      type: String,
      validate: {
        validator: (url) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на первоисточник статьи',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', articleSchema);
