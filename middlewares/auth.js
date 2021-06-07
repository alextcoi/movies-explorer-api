const jwt = require('jsonwebtoken');
const AuthLoginError = require('../errors/auth-login-error');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env')});

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization) {
    throw new AuthLoginError('Необходима авторизация');
  }

  const token = authorization.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "asdfasdf");
  } catch (err) {
    throw new AuthLoginError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
