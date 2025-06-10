const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(1).max(255);
const email = Joi.string().email();
const password = Joi.string()
  .min(8)
  .max(128)
  .pattern('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\'":|,.<>\\/?]+$');

const userEmailSchema = Joi.object({
  email: email.required(),
});

const userIdSchema = Joi.object({
  userId: id.required(),
});

const signUpSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
});

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

module.exports = {
  userEmailSchema,
  userIdSchema,
  signUpSchema,
  loginSchema,
};
