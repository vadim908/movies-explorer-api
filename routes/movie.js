const router = require('express').Router(); // создали роутер

const {
  addNewMovie, infoMovie, delMovie,
} = require('../controllers/movie');

router.get('/', infoMovie);
router.post('/', addNewMovie);
router.delete('/:movieId', delMovie);

module.exports = router;
