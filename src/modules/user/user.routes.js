const express = require('express');
const routes = express.Router();
const authRoutes = express.Router();

const { validatorHandler } = require('../../middlewares/validator.handler');
const { userIdSchema, signUpSchema, loginSchema } = require('./user.schemas');

const userControllers = require('./user.controllers');

routes.get('/',
  userControllers.getAllUsers
);

routes.get('/:userId',
  validatorHandler(userIdSchema, 'params'),
  userControllers.getOneUser
);

routes.post('/sign-up',
  validatorHandler(signUpSchema, 'body'),
  userControllers.createUser
);

authRoutes.post('/login',
  validatorHandler(loginSchema, 'body'),
  userControllers.login
);

routes.patch('/:userId',
  validatorHandler(userIdSchema, 'params'),
  userControllers.updateUser
);

module.exports = { routes, authRoutes };
