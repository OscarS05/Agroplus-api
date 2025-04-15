const Joi = require('joi');

const id = Joi.number().integer();
const description = Joi.string().max(255);
const vaccine = Joi.string().min(1).max(255);

const vaccinationIdSchema = Joi.object({
  vaccinationId: id.required(),
});

const createVaccinationSchema = Joi.object({
  vaccine: vaccine.required(),
  description: description.optional(),
  animalId: id.required(),
});

const updateVaccinationSchema = Joi.object({
  vaccine: vaccine.required(),
  description: description.optional(),
});

module.exports = {
  vaccinationIdSchema,
  createVaccinationSchema,
  updateVaccinationSchema,
};
