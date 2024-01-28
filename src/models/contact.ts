import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IContact extends Document {
  iconUrl: string;
  text: string;
  altText: string;
}

const contactSchema = new Schema<IContact>(
  {
    iconUrl: {
      type: String,
      required: [true, 'не передана ссылка на иконку контакта'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на иконку контакта',
      },
    },
    text: {
      type: String,
      required: [true, 'не передан текст контакта'],
      minlength: [2, 'длина текста контакта должна быть не менее 2 символов'],
      maxlength: [60, 'длина альтернативного текста контакта должна быть не более 60 символов'],
    },
    altText: {
      type: String,
      minlength: [2, 'длина альтернативного текста контакта должна быть не менее 2 символов'],
      maxlength: [30, 'длина альтернативного текста контакта должна быть не более 30 символов'],
    },
  },
  { versionKey: false },
);

export default model('contact', contactSchema);
