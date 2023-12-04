// Импорт npm-пакетов
import express from 'express';
import mongoose from 'mongoose';

// Импорт миддлвэров
import errorHandler from './middlwares/errorHandler';

// Импорт роутера
import router from './routes/index';

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

mongoose.connect('mongodb://127.0.0.1:27017/irkcomposersdb', options);

// Роутер
app.use(router);

// Миддлвэры для обработки ошибок
app.use(errorHandler); // централизолванная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
