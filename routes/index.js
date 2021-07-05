const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);// логинимся на сервисе

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);// регистрация нового пользователя

routes.get('/health', (req, res) => {
  res.send('проверка здоровья');
});

routes.use(auth);// вход по токену

routes.use('/users', usersRouter);// методы для пользователей
routes.use('/movies', moviesRouter);// методы для карточек

routes.use((req, res, next) => {
  const err = new NotFoundError('Такой страницы у нас нет');
  next(err);
});// проверка корректности роута

module.exports = routes;
