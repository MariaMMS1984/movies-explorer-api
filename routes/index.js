const express = require('express');

const routes = express.Router();

const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/validate');

const {
  login,
  createUser,
  logOut,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

routes.post('/signin', validateLogin, login);
routes.post('/signup', validateCreateUser, createUser);
routes.use(auth);
routes.use('/users', userRouter);
routes.use('/movies', movieRouter);
routes.get('/signout', logOut);

module.exports = routes;
