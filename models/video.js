const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');

const videoSchema = new mongoose.Schema(
  {
    composerName: {
      type: String,
      required: [true, 'не передан имя автора произведения'],
      minlength: [2, 'длина имени автора произведения должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени автора произведения должна быть не более 30 символов'],
    },
    composerSurname: {
      type: String,
      required: [true, 'не передана фамилия автора произведения'],
      minlength: [2, 'длина фамилии автора произведения должна быть не менее 2 символов'],
      maxlength: [30, 'длина фамилии автора произведения должна быть не более 30 символов'],
    },
    title: {
      type: String,
      required: [true, 'не передано название произведения'],
      minlength: [2, 'длина название произведения должна быть не менее 2 символов'],
      maxlength: [60, 'длина название произведения должна быть не более 60 символов'],
    },
    performer: {
      type: String,
      required: [true, 'не передан исполнитель(и) произведения'],
      minlength: [2, 'длина исполнителя произведения должна быть не менее 2 символов'],
    },
    duration: {
      type: Number,
      required: [true, 'не передана длительность произведения'],
    },
    videoUrl: {
      type: String,
      required: [true, 'не передана ссылка на аудиофайл'],
      validate: {
        validator: (url) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на аудиофайл',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', videoSchema);
