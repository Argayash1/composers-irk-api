import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IVideo extends Document {
  composer?: string;
  title: string;
  performer?: string;
  iframeUrl: string;
}

const videoSchema = new Schema<IVideo>(
  {
    composer: {
      type: String,
      minlength: [2, 'длина имени композитора должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени композитора должна быть не более 30 символов'],
    },
    title: {
      type: String,
      required: [true, 'не передано название произведения'],
      minlength: [2, 'длина названия произведения должна быть не менее 2 символов'],
      maxlength: [100, 'длина названия произведения должна быть не более 100 символов'],
    },
    performer: {
      type: String,
      minlength: [2, 'длина исполнителя произведения должна быть не менее 2 символов'],
    },
    iframeUrl: {
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

export default model<IVideo>('video', videoSchema);
