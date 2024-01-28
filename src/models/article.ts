import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IArticle extends Document {
  imageUrl: string;
  createdAt?: Date;
  title: string;
  articleDescription: string;
  articleText: string;
  sourceUrl?: string;
}

const articleSchema = new Schema<IArticle>(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на изображение для статьи'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
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
      maxlength: [100, 'длина заголовка статьи должна быть не более 100 символов'],
    },
    articleDescription: {
      type: String,
      required: [true, 'не передано описание статьи'],
      minlength: [2, 'длина описания статьи должна быть не менее 2 символов'],
    },
    articleText: {
      type: String,
      required: [true, 'не передан текст статьи'],
      minlength: [2, 'длина текста статьи должна быть не менее 2 символов'],
    },
    sourceUrl: {
      type: String,
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на первоисточник статьи',
      },
    },
  },
  { versionKey: false },
);

export default model<IArticle>('article', articleSchema);
