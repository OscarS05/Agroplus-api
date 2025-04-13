const express = require('express');
const routes = express.Router();

const { validatorHandler } = require('../../middlewares/validator.handler');
const { userIdSchema, signUpSchema } = require('./user.schemas');

const userControllers = require('./user.controllers');

routes.get('/:userId',
  validatorHandler(userIdSchema, 'params'),
  userControllers.getOneUser
);

routes.post('/',
  validatorHandler(signUpSchema, 'body'),
  userControllers.createUser
);

routes.patch('/:userId',
  validatorHandler(userIdSchema, 'params'),
  userControllers.updateUser
);

module.exports = routes;
