const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { bodyNotesSchema, notesIdSchema } = require('./notes.schemas');

const notesControllers = require('./notes.controllers');

routes.get('/',
  validateSession,
  notesControllers.getAllNotes
);

routes.post('/',
  validateSession,
  validatorHandler(bodyNotesSchema, 'body'),
  notesControllers.createNote
);

routes.patch('/:noteId',
  validateSession,
  validatorHandler(notesIdSchema, 'params'),
  validatorHandler(bodyNotesSchema, 'body'),
  notesControllers.updateNote
);

routes.delete('/:noteId',
  validateSession,
  validatorHandler(notesIdSchema, 'params'),
  notesControllers.deleteNote
);

module.exports = routes;
