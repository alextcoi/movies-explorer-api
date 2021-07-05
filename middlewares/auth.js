const jwt = require('jsonwebtoken');
const path = require('path');
const AuthLoginError = require('../errors/auth-login-error');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AuthLoginError('Необходима авторизация');
  }

  const token = authHeader.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'asdfasdf',
    );
  } catch (err) {
    throw new AuthLoginError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
