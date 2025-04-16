const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { animalIdSchema } = require('../animal/animal.schemas');
const { bodyDewormingSchema, dewormingIdSchema, dewormingSchema } = require('./deworming.schemas');

const dewormingControllers = require('./deworming.controllers');

routes.get('/deworming',
  validateSession,
  dewormingControllers.getAllDeworming
);

routes.post('/:animalId/deworming',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  validatorHandler(bodyDewormingSchema, 'body'),
  dewormingControllers.createDeworming
);

routes.patch('/deworming/:dewormingId',
  validateSession,
  validatorHandler(dewormingIdSchema, 'params'),
  validatorHandler(bodyDewormingSchema, 'body'),
  dewormingControllers.updateDeworming
);

routes.delete('/deworming/:dewormingId',
  validateSession,
  validatorHandler(dewormingIdSchema, 'params'),
  dewormingControllers.deleteDeworming
);

module.exports = routes;
