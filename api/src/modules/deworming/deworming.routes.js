const express = require('express');

const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { animalIdSchema } = require('../animal/animal.schemas');
const {
  bodyDewormingSchema,
  dewormingIdSchema,
  querySchema,
} = require('./deworming.schemas');

const dewormingControllers = require('./deworming.controllers');

/**
 * @swagger
 * /animals/deworming:
 *   get:
 *     summary: Get all deworming records
 *     description: |
 *       Retrieves all deworming records of animals that belong to the authenticated user.
 *       - Supports query parameters to filter by `deworming` or `animalId` (UUID).
 *       - Authentication is handled automatically via cookies.
 *     tags:
 *       - deworming
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: dewormer
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by dewormer name
 *       - in: query
 *         name: animalId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by animal UUID
 *     responses:
 *       200:
 *         description: List of deworming records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deworming:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Deworming'
 *                 sucess:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
routes.get(
  '/deworming',
  validateSession,
  validatorHandler(querySchema, 'query'),
  dewormingControllers.getAllDeworming,
);

/**
 * @swagger
 * /animals/{animalId}/deworming:
 *   post:
 *     summary: Create a deworming record
 *     description: |
 *       Creates a new deworming record for a specific animal.
 *       - The animal must belong to the authenticated user.
 *       - Authentication is handled via cookies automatically by the system.
 *     tags:
 *       - deworming
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the animal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/bodySchemaDeworming'
 *     responses:
 *       201:
 *         description: Deworming record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deworming was successfully created
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 newDeworming:
 *                    $ref: '#/components/schemas/Deworming'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
routes.post(
  '/:animalId/deworming',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  validatorHandler(bodyDewormingSchema, 'body'),
  dewormingControllers.createDeworming,
);

/**
 * @swagger
 * /animals/deworming/{dewormingId}:
 *   patch:
 *     summary: Update a deworming record
 *     description: |
 *       Updates the data of a specific deworming record.
 *       - The deworming record must belong to an animal of the authenticated user.
 *       - Authentication is handled via cookies automatically by the system.
 *     tags:
 *       - deworming
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: dewormingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the deworming record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/bodySchemaDeworming'
 *     responses:
 *       200:
 *         description: Deworming record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deworming was successfully updated
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updatedDeworming:
 *                    $ref: '#/components/schemas/Deworming'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Deworming record not found
 */
routes.patch(
  '/deworming/:dewormingId',
  validateSession,
  validatorHandler(dewormingIdSchema, 'params'),
  validatorHandler(bodyDewormingSchema, 'body'),
  dewormingControllers.updateDeworming,
);

/**
 * @swagger
 * /animals/deworming/{dewormingId}:
 *   delete:
 *     summary: Delete a deworming record
 *     description: |
 *       Deletes a specific deworming record.
 *       - The record must belong to an animal that is owned by the authenticated user.
 *       - Authentication is handled via cookies automatically by the system.
 *     tags:
 *       - deworming
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: dewormingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the deworming record to delete
 *     responses:
 *       200:
 *         description: Deworming record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deworming was successfully deleted
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedDeworming:
 *                   type: number
 *                   example: 1
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not the owner of the animal)
 *       404:
 *         description: Deworming record not found
 */
routes.delete(
  '/deworming/:dewormingId',
  validateSession,
  validatorHandler(dewormingIdSchema, 'params'),
  dewormingControllers.deleteDeworming,
);

module.exports = routes;
