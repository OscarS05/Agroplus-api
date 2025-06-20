const Joi = require('joi');

const id = Joi.string().uuid();
const description = Joi.string().max(255);
const vaccine = Joi.string().min(1).max(255);

const vaccinationSchema = Joi.object({
  vaccinationId: id.required(),
});

const vaccinationIdSchema = Joi.object({
  vaccinationId: id.required(),
});

const querySchema = Joi.object({
  vaccine: vaccine.optional(),
  animalId: id.optional(),
});

const bodyVaccinationSchema = Joi.object({
  vaccine: vaccine.required(),
  description: description.optional(),
});

const bodyToUpdateVaccinationSchema = Joi.object({
  vaccine: vaccine.optional(),
  description: description.optional(),
});

module.exports = {
  vaccinationSchema,
  vaccinationIdSchema,
  bodyVaccinationSchema,
  querySchema,
  bodyToUpdateVaccinationSchema,
};
