const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorBadRequest = require('../errors/incorrect');
const ErrorNotFound = require('../errors/notfound');
const ErrorConflict = require('../errors/repeat');

const { JWT_SECRET } = process.env;

const getJwtToken = (id) => {
  const token = jwt.sign({ payload: id }, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
  return token;
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(201).send({
          email: user.email,
          name: user.name,
        }))
        .catch((error) => {
          if (error.name === 'MongoServerError' || error.code === 11000) {
            next(new ErrorConflict('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (error.name === 'ValidationError') {
            next(new ErrorBadRequest('Переданы неккоректные данные для создания пользователя.'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken(user._id);
      // res
      // .cookie('jwt', token, {
      // maxage: 3600000 * 24 * 7,
      // httpOnly: true,
      // })
      // .send({ message: 'Успешная авторизация.' });

      res.status(200).send({ token });
    })
    .catch(next);
};

const getThisUser = (req, res, next) => {
  User.findById(req.user.payload)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      } else res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user.payload,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.code === 11000) {
        next(new ErrorBadRequest('Передан некорректный id пользователя.'));
      } else {
        next(error);
      }
    });
};

const logOut = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true,
    })
    .status(200)
    .send({ message: 'Пользователь разлогинен' });
};

module.exports = {
  createUser,
  login,
  getThisUser,
  updateUser,
  logOut,
};
