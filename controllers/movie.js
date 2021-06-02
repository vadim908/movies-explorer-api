const Movie = require('../models/movie');
const IncorrentDataError = require('../errors/IncorrentDataError');
const NotFoundError = require('../errors/not-found-err');
const IncorrentUserId = require('../errors/incorrentUserId');

module.exports.infoMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.addNewMovie = (req, res, next) => {
  const userId = { _id: req.user._id };
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: userId,
    },
  )
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrentDataError('Переданы некорректные данные');
      } else if (err.name === 'ValidationError') {
        throw new IncorrentDataError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.delMovie = (req, res, next) => {
  const { movieId } = req.params.movieId;
  Movie.findOne(movieId)
    .orFail(() => new Error('NotFound'))
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка не найдена');
      } else if (movie.owner.toString() === req.user._id) {
        Movie.findOneAndRemove(movieId, { runValidators: true, new: true })
          .then(() => {
            res.status(200).send(movie);
          });
      } else {
        throw new IncorrentUserId(' У вас нет прав удалять данный фильм');
      }
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrentDataError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Фильм не найден');
      }
      next(err);
    })
    .catch(next);
};
