const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { animalIdSchema } = require('../animal/animal.schemas');
const { bodyVaccinationSchema, vaccinationIdSchema, vaccinationSchema } = require('./vaccination.schemas');

const vaccinationControllers = require('./vaccination.controllers');

routes.get('/vaccination',
  validateSession,
  vaccinationControllers.getAllVaccination
);

routes.post('/:animalId/vaccination',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  validatorHandler(bodyVaccinationSchema, 'body'),
  vaccinationControllers.createVaccination
);

routes.patch('/vaccination/:vaccinationId',
  validateSession,
  validatorHandler(vaccinationIdSchema, 'params'),
  validatorHandler(bodyVaccinationSchema, 'body'),
  vaccinationControllers.updateVaccination
);

routes.delete('/vaccination/:vaccinationId',
  validateSession,
  validatorHandler(vaccinationIdSchema, 'params'),
  vaccinationControllers.deleteVaccination
);

module.exports = routes;
