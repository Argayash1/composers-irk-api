const mongoose = require('mongoose');

const isUrl = require('validator/lib/isURL');

const reportSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, 'не передан год отчёта'],
    },
    reportUrl: {
      type: String,
      required: [true, 'не передана ссылка на файл отчёта'],
      validate: {
        validator: (url) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на файл отчёта',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', reportSchema);
