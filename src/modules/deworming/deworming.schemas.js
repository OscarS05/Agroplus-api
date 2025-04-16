const Joi = require('joi');

const id = Joi.number().integer();
const description = Joi.string().max(255);
const dewormer = Joi.string().min(1).max(255);

const dewormingSchema = Joi.object({
  animalId: id.required(),
  dewormingId: id.required(),
});

const dewormingIdSchema = Joi.object({
  dewormingId: id.required(),
});

const bodyDewormingSchema = Joi.object({
  dewormer: dewormer.required(),
  description: description.optional(),
});

module.exports = {
  dewormingIdSchema,
  dewormingSchema,
  bodyDewormingSchema,
};
