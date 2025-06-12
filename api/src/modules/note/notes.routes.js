const express = require('express');

const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const {
  bodyNotesSchema,
  notesIdSchema,
  querySchema,
  bodyToUpdateNotesSchema,
} = require('./notes.schemas');

const notesControllers = require('./notes.controllers');

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     description: |
 *       Retrieves all notes belonging to the authenticated user.
 *       You can **optionally** filter by `title` using query parameters.
 *       - Requires accessToken (sent automatically via cookies).
 *     tags:
 *       - notes
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter notes by title
 *     responses:
 *       200:
 *         description: List of user notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 sucess:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 */
routes.get(
  '/',
  validateSession,
  validatorHandler(querySchema, 'query'),
  notesControllers.getAllNotes,
);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: |
 *       Creates a new note for the authenticated user.
 *       - Requires accessToken (sent automatically via cookies).
 *       - Requires `title` in the request body.
 *     tags:
 *       - notes
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/bodyNote'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note was successfully created
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 newNote:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 */
routes.post(
  '/',
  validateSession,
  validatorHandler(bodyNotesSchema, 'body'),
  notesControllers.createNote,
);

/**
 * @swagger
 * /notes/{noteId}:
 *   patch:
 *     summary: Update a note
 *     description: |
 *       Updates a note by its ID.
 *       - Requires accessToken (sent automatically via cookies).
 *       - Requires `noteId` in params (UUID) and `title` and optionally `description`in the body.
 *     tags:
 *       - notes
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/bodyNote'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note was successfully updated
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updatedNote:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 *       404:
 *         description: Note not found or does not belong to the user
 */
routes.patch(
  '/:noteId',
  validateSession,
  validatorHandler(notesIdSchema, 'params'),
  validatorHandler(bodyToUpdateNotesSchema, 'body'),
  notesControllers.updateNote,
);

/**
 * @swagger
 * /notes/{noteId}:
 *   delete:
 *     summary: Delete a note
 *     description: |
 *       Deletes a note by its ID.
 *       - Requires accessToken (sent automatically via cookies).
 *       - Requires `noteId` in params (UUID).
 *     tags:
 *       - notes
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note was successfully deleted
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedNote:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Note not found or does not belong to the user
 */
routes.delete(
  '/:noteId',
  validateSession,
  validatorHandler(notesIdSchema, 'params'),
  notesControllers.deleteNote,
);

module.exports = routes;
