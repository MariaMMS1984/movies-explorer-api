const express = require('express');

const users = express.Router();
const {
  validateUserUpdate,
} = require('../middlewares/validate');
const {
  getThisUser, updateUser,
} = require('../controllers/users');

users.get('/me', getThisUser);
users.patch('/me', validateUserUpdate, updateUser);

module.exports = users;
