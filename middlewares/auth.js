const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

const UnauthorizedError = require('../errors/autharization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    next(new UnauthorizedError('Необходима авторизация.'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Неправильный токен. Необходима авторизация.');
  }

  req.user = payload;

  next();
};
