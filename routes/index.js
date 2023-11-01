const express = require('express');

const routes = express.Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

routes.use('/users', userRouter);
routes.use('/movies', movieRouter);

module.exports = routes;
