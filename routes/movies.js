const express = require('express');

const movies = express.Router();
const {
  validateCreateMovie,
  validateMovieId,
} = require('../middlewares/validate');
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');

movies.post('/', validateCreateMovie, createMovie);
movies.get('/', getMovies);
movies.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movies;
