const Joi = require('joi');

const id = Joi.number().integer();
const livestockType = Joi.string().min(1).max(80);
const animalType = Joi.string().min(1).max(100);
const code = Joi.string().min(2).max(128);
const name = Joi.string().min(2).max(128);
const sex = Joi.string().valid('male', 'female');

const animalIdSchema = Joi.object({
  animalId: id.required(),
});

const createAnimalsSchema = Joi.object({
  livestockType: livestockType.required(),
  animalType: animalType.required(),
  code: code.required(),
  name: name.optional(),
  sex: sex.required(),
  motherId: id.optional(),
  fatherId: id.optional(),
});

const updateAnimalsSchema = Joi.object({
  livestockType: livestockType.required(),
  animalType: animalType.required(),
  code: code.optional(),
  name: name.optional()
});

module.exports = {
  animalIdSchema,
  createAnimalsSchema,
  updateAnimalsSchema,
};
