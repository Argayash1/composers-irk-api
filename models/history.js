const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    articleSection: [{
      title: {
        type: String,
        required: [true, 'не передан заголовок раздела статьи'],
        minlength: [2, 'длина заголовка раздела статьи должна быть не менее 2 символов'],
        maxlength: [30, 'длина заголовка раздела статьи должна быть не более 60 символов'],
      },
      sectionText: [{
        type: String,
        required: [true, 'не передано описание статьи'],
        minlength: [2, 'длина описания статьи должна быть не менее 2 символов'],
      }],
    }],
    author: {
      type: String,
      required: [true, 'не передан заголовок раздела статьи'],
      minlength: [2, 'длина заголовка раздела статьи должна быть не менее 2 символов'],
      maxlength: [30, 'длина заголовка раздела статьи должна быть не более 60 символов'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('news', historySchema);
