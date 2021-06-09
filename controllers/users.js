const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const WrongDataError = require('../errors/wrong-request-data');
const DatabaseError = require('../errors/db-error');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT = 10;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'asdfasdf',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ user });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', { path: '/' });
  return res.sendStatus(200);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((item) => res.send(item))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, SALT)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send({ ...user._doc, password: undefined });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        throw new WrongDataError('Переданы некорректные данные при поиске пользователя');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new DatabaseError('Пользователь с указанным email уже существует');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  )
    .then((item) => {
      if (!item) { throw new NotFoundError('Пользователь по указанному _id не найден'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.statusCode === 404) { next(err); }
      if (err.name === 'TypeError') {
        throw new WrongDataError('Переданы некорректные данные при поиске пользователя');
      }

      throw err;
    })
    .catch(next);
};
