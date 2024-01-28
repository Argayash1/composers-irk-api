import { Schema, model, Document } from 'mongoose';

interface Ihistory extends Document {
  text: string;
  author?: string;
}

const historySchema = new Schema<Ihistory>(
  {
    text: {
      type: String,
      required: [true, 'не передан текст истории Союза'],
      minlength: [2, 'длина текста истории Союза должна быть не менее 2 символов'],
    },
    author: {
      type: String,
      minlength: [2, 'длина автора истории Союза должна быть не менее 2 символов'],
      maxlength: [60, 'длина автора истории Союза должна быть не более 60 символов'],
    },
  },
  { versionKey: false },
);

export default model('history', historySchema);
