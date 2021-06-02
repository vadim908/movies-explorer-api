module.exports.errorHandler = (res, ERROR_CODE = 500, message = 'Возникла ошибка') => {
  res.status(ERROR_CODE).send({ message });
};
