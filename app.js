const express = require("express");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors, celebrate, Joi } = require('celebrate');
const moviesRouter = require("./routes/movies");
const usersRouter = require("./routes/users");
const { login, createUser, logout } = require("./controllers/users");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require("./middlewares/auth");
const NotFoundError = require('./errors/not-found-error');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const app = express();

// app.use(cors({
//   origin: 'https://lastsprint.nomoredomains.monster',
//   credentials: true,
// }));

// https://lastsprint.nomoredomains.monster
// https://api.tcoi.nomoredomains.icu
// http://localhost:3001

app.use(express.json());
app.use(helmet());

app.use(requestLogger);// логгер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  })
}), login);// логинимся на сервисе

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  })
}), createUser);// регистрация нового пользователя

app.use(auth);// вход по токену

app.use("/users", usersRouter);// методы для пользователей
app.use("/movies", moviesRouter);// методы для карточек

app.post('/signout', logout);// метод для разлогиннига

app.use("/:wrongRoute", (req, res, next) => {
  const err = new NotFoundError('Такой страницы у нас нет');
  next(err);
});// проверка корректности роута

app.use(errorLogger); // логгер ошибок

app.use(errors());// проверка данных для сервера

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});// централизованная обработка ошибок

async function launch() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
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
