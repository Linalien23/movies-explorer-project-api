require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
const router = require('./routes/index');
const limiter = require('./middleware/rateLimiter');
const errorsHandler = require('./middleware/errorsHandler');
const { MOVIES_DEV_DB } = require('./constants/dataBasePath');

const { NODE_ENV, MOVIES_DB } = process.env;
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? MOVIES_DB : MOVIES_DEV_DB, {
  useNewUrlParser: true,
});

app.use(cors());

app.use(express.json());

app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт.');
  }, 0);
});

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
  console.log(`App listening on port ${NODE_ENV === 'production' ? PORT : 3000}`);
});
