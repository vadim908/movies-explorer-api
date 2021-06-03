const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');

const {
  infoUser, updateProfill,
} = require('../controllers/user');

router.get('/me', infoUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfill);

module.exports = router;
