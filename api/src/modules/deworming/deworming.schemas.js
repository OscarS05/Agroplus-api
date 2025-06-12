const Joi = require('joi');

const id = Joi.string().uuid();
const description = Joi.string().max(255);
const dewormer = Joi.string().min(1).max(255);

const dewormingSchema = Joi.object({
  animalId: id.required(),
  dewormingId: id.required(),
});

const querySchema = Joi.object({
  dewormer: dewormer.optional(),
  animalId: id.optional(),
});

const dewormingIdSchema = Joi.object({
  dewormingId: id.required(),
});

const bodyDewormingSchema = Joi.object({
  dewormer: dewormer.optional(),
  description: description.optional(),
});

module.exports = {
  dewormingIdSchema,
  dewormingSchema,
  bodyDewormingSchema,
  querySchema,
};
