require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const cors = require('cors');

const app = express();
app.use(cors());
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorGlobal } = require('./middlewares/errorGlobal');
const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/notfound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { DB } = require('./config');

app.use(cookieParser());

mongoose.connect(DB, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const {
  createUser, login,
} = require('./controllers/users');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  next(new ErrorNotFound('Такой страницы не существует.'));
});

app.use(errorGlobal); // подключаем централизированный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
