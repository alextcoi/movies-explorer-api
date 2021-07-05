const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const app = express();

app.use(cors({
  origin: ['https://tcoi.nomoredomains.club', 'http://tcoi.nomoredomains.club'],
  credentials: true,
}));

// https://lastsprint.nomoredomains.monster
// https://api.tcoi.nomoredomains.icu
// http://localhost:3001

app.use(express.json());
app.use(helmet());

app.use(requestLogger);// логгер запросов

app.use(routes);

app.use(errorLogger); // логгер ошибок

app.use(errors());// проверка данных для сервера

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});// централизованная обработка ошибок

async function launch() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);
}

launch();// слушаем сервер

// https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg

// "country": "test",
// "director": "test",
// "duration": "10",
// "year": "test",
// "description": "test",
// "image": "https://ya.ru",
// "trailer": "https://ya.ru",
// "thumbnail": "https://ya.ru",
// "nameRU": "test",
// "nameEN": "test",
// "movieId": "test"
