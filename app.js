const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH } = process.env;
const { newUser, login } = require('./controllers/user');
const IncorrentServerError = require('./errors/incorrentServerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

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
app.post('/signup', newUser);

app.post('/signin', login);
app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

app.use(errorLogger);
app.use('*', require('./routes/notFound'));

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    throw new IncorrentServerError('Что-то пошло не так.');
  }
  if (next) next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер');
  // eslint-disable-next-line no-console
  console.log(BASE_PATH);
});
