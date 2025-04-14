const { ValidationError } = require("sequelize");
const Boom = require('@hapi/boom');

function logErrors(err, req, res, next){
  next(err);
}

function ormErrorHandler(err, req, res, next){
  if(err instanceof ValidationError){
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors
    });
  }
  next(err);
}

function boomErrorHandler(err, req, res, next){
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next){
  console.log('err:', err);
  res.status(500).json({
    message: err,
    stack: err.message,
  });
}
module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };
