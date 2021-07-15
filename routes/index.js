const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { newUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), newUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.use(auth);

router.use('/users', require('./user'));
router.use('/movies', require('./movie'));

router.use('*', require('./notFound'));

module.exports = router;
