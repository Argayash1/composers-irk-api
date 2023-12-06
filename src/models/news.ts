import { Schema, model, Document } from 'mongoose';
import isUrl from 'validator/lib/isURL';

interface INews extends Document {
  imageUrl: string;
  createdAt?: Date;
  title: string;
  newsText: string;
}

const newsSchema = new Schema<INews>(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на изображение для новости'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
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

export default model<INews>('news', newsSchema);
