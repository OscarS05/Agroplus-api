const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { createDewormingSchema, dewormingIdSchema, updateDewormingSchema } = require('./deworming.schemas');

const dewormingControllers = require('./deworming.controllers');

routes.get('/',
  validateSession,
  dewormingControllers.getAllDeworming
);

routes.post('/',
  validateSession,
  validatorHandler(createDewormingSchema, 'body'),
  dewormingControllers.createDeworming
);

routes.patch('/:dewormingId',
  validateSession,
  validatorHandler(dewormingIdSchema, 'params'),
  validatorHandler(updateDewormingSchema, 'body'),
  dewormingControllers.updateDeworming
);

routes.delete('/:dewormingId',
  validateSession,
  validatorHandler(dewormingIdSchema, 'params'),
  dewormingControllers.deleteDeworming
);

module.exports = routes;
