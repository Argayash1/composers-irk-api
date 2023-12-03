import mongoose from 'mongoose';

import isUrl from 'validator/lib/isURL';

const audioSchema = new mongoose.Schema(
  {
    composerName: {
      type: String,
      required: [true, 'не передано имя автора произведения'],
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
      minlength: [2, 'длина исполнителя произведения должна быть не менее 2 символов'],
    },
    audioUrl: {
      type: String,
      required: [true, 'не передана ссылка на аудиофайл'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на аудиофайл',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', audioSchema);
