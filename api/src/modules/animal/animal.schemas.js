const Joi = require('joi');

const id = Joi.string().uuid();
const livestockType = Joi.string().min(1).max(80);
const animalType = Joi.string().min(1).max(100);
const breed = Joi.string().min(2).max(128);
const code = Joi.string().min(2).max(128);
const sex = Joi.string().valid('Male', 'Female');
const date = Joi.date();

const animalIdSchema = Joi.object({
  animalId: id.required(),
});

const querySchema = Joi.object({
  animalId: id.optional(),
  livestockType: livestockType.optional(),
  animalType: animalType.optional(),
  code: code.optional(),
  breed: breed.optional(),
  sex: sex.optional(),
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
  livestockType: livestockType.optional(),
  animalType: animalType.optional(),
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
  querySchema,
};
