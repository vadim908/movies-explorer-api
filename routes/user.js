const router = require('express').Router(); // создали роутер

const {
  infoUser, updateProfill,
} = require('../controllers/user');

router.get('/', infoUser);
router.patch('/me', updateProfill);

module.exports = router;
