const Boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if(error){
      next(Boom.badRequest(error));
    }
    else {
      next();
    }
  }
}

module.exports = { validatorHandler };
