const router = require('express').Router(); // создали роутер

const auth = require('../middlewares/auth');

router.use(auth);

router.use('/users', require('./user'));
router.use('/movies', require('./movie'));

router.use('*', require('./notFound'));

module.exports = router;
