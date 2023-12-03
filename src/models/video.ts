import mongoose from 'mongoose';

import isUrl from 'validator/lib/isURL';

const videoSchema = new mongoose.Schema(
  {
    composerName: {
      type: String,
      minlength: [2, 'длина имени композитора должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени композитора должна быть не более 30 символов'],
    },
    composerSurname: {
      type: String,
      minlength: [2, 'длина фамилии композитора должна быть не менее 2 символов'],
      maxlength: [30, 'длина фамилии композитора должна быть не более 30 символов'],
    },
    title: {
      type: String,
      required: [true, 'не передано название произведения'],
      minlength: [2, 'длина названия произведения должна быть не менее 2 символов'],
      maxlength: [60, 'длина названия произведения должна быть не более 60 символов'],
    },
    performer: {
      type: String,
      minlength: [2, 'длина исполнителя произведения должна быть не менее 2 символов'],
    },
    iFrameUrl: {
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

module.exports = mongoose.model('news', videoSchema);
