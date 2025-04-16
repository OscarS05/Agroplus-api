const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { animalIdSchema, createAnimalsSchema, updateAnimalsSchema } = require('./animal.schemas');

const animalControllers = require('./animal.controllers');

routes.get('/',
  validateSession,
  animalControllers.getAllAnimals
);

routes.get('/animal/:animalId',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  animalControllers.getOneAnimal
);

routes.post('/',
  validateSession,
  validatorHandler(createAnimalsSchema, 'body'),
  animalControllers.createAnimal
);

routes.patch('/:animalId',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  validatorHandler(updateAnimalsSchema, 'body'),
  animalControllers.updateAnimal
);

routes.delete('/:animalId',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  animalControllers.deleteAnimal
);

module.exports = routes;
