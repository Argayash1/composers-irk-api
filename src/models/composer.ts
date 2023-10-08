import mongoose from 'mongoose';

import isUrl from 'validator/lib/isURL';

const composerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на фотографию композитора или музыковеда'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на изображение для проекта',
      },
    },
    name: {
      type: String,
      required: [true, 'не передано имя композитора или музыковеда'],
      minlength: [2, 'длина имени должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени должна быть не более 30 символов'],
    },
    patronymic: {
      type: String,
      required: [true, 'не передано отчество композитора или музыковеда'],
      minlength: [2, 'длина отчества должна быть не менее 2 символов'],
      maxlength: [30, 'длина отчества должна быть не более 30 символов'],
    },
    surname: {
      type: String,
      required: [true, 'не передана фамилия композитора или музыковеда'],
      minlength: [2, 'длина фамилии должна быть не менее 2 символов'],
      maxlength: [30, 'длина фамилии должна быть не более 30 символов'],
    },
    profession: {
      type: String,
      required: [true, 'не передана профессия'],
      minlength: [2, 'длина профессии должна быть не менее 2 символов'],
      maxlength: [30, 'длина профессии должна быть не более 30 символов'],
    },
    biography: {
      type: String,
      required: [true, 'не передана автобиография композитора или музыковеда'],
      minlength: [2, 'длина описания проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина описания проекта должна быть не более 60 символов'],
    },
    works: {
      type: String,
      required: [true, 'не передан список произведений или публикаций'],
      minlength: [2, 'длина описания проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина описания проекта должна быть не более 60 символов'],
    },
    competitions: [{
      type: String,
      minlength: [2, 'длина описания проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина описания проекта должна быть не более 60 символов'],
    }],

    awards: [{
      type: String,
      minlength: [2, 'длина описания проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина описания проекта должна быть не более 60 символов'],
    }],
    links: [{
      type: String,
      minlength: [2, 'длина описания проекта должна быть не менее 2 символов'],
      maxlength: [30, 'длина описания проекта должна быть не более 60 символов'],
    }],
  },
  { versionKey: false },
);

module.exports = mongoose.model('composer', composerSchema);
