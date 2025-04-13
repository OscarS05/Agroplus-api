const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(1).max(255);
const email = Joi.string().email();
const password = Joi.string().min(8).max(128).pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\'":|,.<>\\/?]+$'));

const userIdSchema = Joi.object({
  userId: id.required(),
});

const signUpSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
});

module.exports = {
  userIdSchema,
  signUpSchema,
};
