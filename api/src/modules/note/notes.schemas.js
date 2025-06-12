const Joi = require('joi');

const id = Joi.string().uuid();
const title = Joi.string().max(255);
const description = Joi.string().min(1).max(255);

const notesIdSchema = Joi.object({
  noteId: id.required(),
});

const bodyNotesSchema = Joi.object({
  title: title.required(),
  description: description.optional(),
});

const bodyToUpdateNotesSchema = Joi.object({
  title: title.optional(),
  description: description.optional(),
});

const querySchema = Joi.object({
  title: title.optional(),
});

module.exports = {
  notesIdSchema,
  bodyNotesSchema,
  querySchema,
  bodyToUpdateNotesSchema,
};
