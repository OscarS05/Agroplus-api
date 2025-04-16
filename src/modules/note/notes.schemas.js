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

module.exports = {
  notesIdSchema,
  bodyNotesSchema,
};
