import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IProject extends Document {
  imageUrl: string;
  title: string;
  description: string;
}

const projectSchema = new Schema<IProject>(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на изображение для проекта'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на изображение для проекта',
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

export default model<IProject>('project', projectSchema);
