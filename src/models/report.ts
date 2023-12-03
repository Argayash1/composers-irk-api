import mongoose from 'mongoose';

import isUrl from 'validator/lib/isURL';

const reportSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, 'не передан год отчёта'],
    },
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на файл отчёта'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на файл отчёта',
      },
    },
    altText: {
      type: String,
      required: [true, 'не передан альтернативный текст для изображения отчёта'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', reportSchema);
