const router = require('express').Router();
const { errorHandler } = require('../utils/errorHandler');

router.all('/*', (req, res) => {
  errorHandler(
    res,
    404,
    'Ресурс не найден',
  );
});

module.exports = router;
