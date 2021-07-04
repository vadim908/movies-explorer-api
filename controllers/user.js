const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotFoundError = require('../errors/not-found-err');
const IncorrentTokenError = require('../errors/incorrentTokenError');
const ConflictError = require('../errors/ConflictError');

module.exports.newUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Данный пользователь уже зарегистрирован');
      } else if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrectDataError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Ресурс не найден');
      }
      next(err);
    })
    .catch(next);
};

module.exports.infoUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      if (!user) {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateProfill = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { runValidators: true, new: true })
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrectDataError('Пользователь с указанным id не найден');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Ресурс не найден');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Данный пользователь уже зарегистрирован');
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      throw new IncorrentTokenError('Неправильная почта или пароль');
    })
    .catch(next);
};

