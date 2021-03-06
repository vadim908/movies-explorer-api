const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  addNewMovie, infoMovie, delMovie,
} = require('../controllers/movie');

router.get('/', infoMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Невалидный url');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Невалидный url');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Невалидный url');
    }),
    movieId: Joi.string().required().hex().length(24),
    nameRU: Joi.string().required().regex(/[а-яё\s]+$/iu),
    nameEN: Joi.string().required().regex(/[a-z\s]+$/iu),
  }),
}), addNewMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), delMovie);

module.exports = router;
