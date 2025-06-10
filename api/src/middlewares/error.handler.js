const { ValidationError } = require('sequelize');

function logErrors(err, req, res, next) {
  next(err);
}

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  }
  next(err);
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('err:', err);
  res.status(500).json({
    message: err,
    stack: err.message,
  });
}
module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };
