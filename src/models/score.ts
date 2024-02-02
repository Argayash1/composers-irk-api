import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IScore extends Document {
  composer: string;
  title: string;
  url: string;
  category: string;
}

const scoreSchema = new Schema<IScore>(
  {
    composer: {
      type: String,
      required: [true, 'не указан автор произведения'],
      minlength: [2, 'длина имени автора произведения должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени автора произведения должна быть не более 30 символов'],
    },
    title: {
      type: String,
      required: [true, 'не передано название произведения'],
      minlength: [2, 'длина название произведения должна быть не менее 2 символов'],
      maxlength: [60, 'длина название произведения должна быть не более 60 символов'],
    },
    url: {
      type: String,
      required: [true, 'не передана ссылка на файл с нотами'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на файл с нотами',
      },
    },
    category: {
      type: String,
      required: [true, 'не указана категория произведения'],
      maxlength: [10, 'длина категории произведения должна быть не более 10 символов'],
    },
  },
  { versionKey: false },
);

export default model<IScore>('score', scoreSchema);
