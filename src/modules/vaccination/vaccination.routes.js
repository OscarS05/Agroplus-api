const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { createVaccinationSchema, updateVaccinationSchema, vaccinationIdSchema } = require('./vaccination.schemas');

const vaccinationControllers = require('./vaccination.controllers');

routes.get('/',
  validateSession,
  vaccinationControllers.getAllVaccination
);

routes.post('/',
  validateSession,
  validatorHandler(createVaccinationSchema, 'body'),
  vaccinationControllers.createVaccination
);

routes.patch('/:vaccinationId',
  validateSession,
  validatorHandler(vaccinationIdSchema, 'params'),
  validatorHandler(updateVaccinationSchema, 'body'),
  vaccinationControllers.updateVaccination
);

routes.delete('/:vaccinationId',
  validateSession,
  validatorHandler(vaccinationIdSchema, 'params'),
  vaccinationControllers.deleteVaccination
);

module.exports = routes;
