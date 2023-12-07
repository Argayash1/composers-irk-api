import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IAudio extends Document {
  composer: string;
  title: string;
  performer?: string;
  audioUrl?: string;
}

const audioSchema = new Schema<IAudio>(
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

export default model('audio', audioSchema);
