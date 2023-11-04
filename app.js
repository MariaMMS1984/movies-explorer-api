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

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  next(new ErrorNotFound('Такой страницы не существует.'));
});
app.use(errorLogger);
app.use(errors());

app.use(errorGlobal); // подключаем централизированный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
