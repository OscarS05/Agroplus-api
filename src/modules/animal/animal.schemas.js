const Joi = require('joi');

const id = Joi.number().integer();
const livestockType = Joi.string().min(1).max(80);
const animalType = Joi.string().min(1).max(100);
const breed = Joi.string().min(2).max(128);
const code = Joi.string().min(2).max(128);
const sex = Joi.string().valid('Male', 'Female');
const date = Joi.date();

const animalIdSchema = Joi.object({
  animalId: id.required(),
});

const createAnimalsSchema = Joi.object({
  livestockType: livestockType.required(),
  animalType: animalType.required(),
  code: code.required(),
  breed: breed.required(),
  sex: sex.required(),
  birthDate: date.optional(),
  motherId: id.optional(),
  fatherId: id.optional(),
});

const updateAnimalsSchema = Joi.object({
  livestockType: livestockType.required(),
  animalType: animalType.required(),
  breed: breed.optional(),
  code: code.optional(),
  sex: sex.optional(),
  birthDate: date.optional(),
  motherId: id.optional(),
  fatherId: id.optional(),
});

module.exports = {
  animalIdSchema,
  createAnimalsSchema,
  updateAnimalsSchema,
};
