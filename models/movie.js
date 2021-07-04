const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: validator.isURL,
    },
  },
  trailer: {
    type: String,
    validate: {
      validator: validator.isURL,
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: validator.isURL,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    match: /[а-яё\s]+$/iu,
  },
  nameEN: {
    type: String,
    required: true,
    match: /[a-z\s]+$/iu,
  },
});

module.exports = mongoose.model('movie', movieSchema);
