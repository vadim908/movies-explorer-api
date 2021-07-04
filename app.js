const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  PORT = 3000, BASE_PATH, BASE_URL, NODE_ENV,
} = process.env;
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { newUser, login } = require('./controllers/user');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHeandler = require('./middlewares/error-heandler');

const app = express();

mongoose.connect('mongodb://localhost:27017/DiplomDataBAse', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(cors());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
  }),
}), newUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use('*', require('./routes/notFound'));

app.use(errors());
app.use(errorHeandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер');
  // eslint-disable-next-line no-console
  console.log(BASE_PATH);
});
