import dotenv from 'dotenv';
dotenv.config();

// Импорт npm-пакетов
import express from 'express';
import mongoose from 'mongoose';

// Импорт миддлвэров
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import errorHandler from './middlwares/errorHandler';
import limiter from './middlwares/limiter';
import { requestLogger, errorLogger } from './middlwares/logger';

// Импорт роутера
import router from './routes/index';
import helmet from 'helmet';
import corsHandler from './middlwares/corsHandler';
import { DB, DB_DEV, NODE_ENV, PORT } from './utils/config';

const app = express();

const options = {
  useNewUrlParser: true,
} as mongoose.ConnectOptions;

if (NODE_ENV === 'production') {
  mongoose.connect(DB!, options);
} else {
  mongoose.connect(DB_DEV, options);
}

// Миддлвэр для логирования запросов
app.use(requestLogger); // подключаем логгер запросов

// Миддлвэры для безопасности (лимитер, хельмет и корс-обработчик)
app.use(limiter);
app.use(helmet());
app.use(corsHandler);

// Миддлвэры для парсинга
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

// Роутер
app.use(router);

// Миддлвэры для обработки ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизолванная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
