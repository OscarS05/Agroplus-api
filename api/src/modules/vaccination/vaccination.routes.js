const express = require('express');

const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { animalIdSchema } = require('../animal/animal.schemas');
const {
  bodyVaccinationSchema,
  vaccinationIdSchema,
} = require('./vaccination.schemas');

const vaccinationControllers = require('./vaccination.controllers');

/**
 * @swagger
 * /animals/vaccination:
 *   get:
 *     summary: Get all vaccination records
 *     description: |
 *       Retrieves the vaccination history for all animals belonging to the authenticated user.
 *       - Supports **optional** filtering by `vaccine` and/or `animalId` via query parameters.
 *       - Requires a valid session (accessToken sent automatically in cookies).
 *     tags:
 *       - vaccination
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: vaccine
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by vaccine name
 *       - in: query
 *         name: animalId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filter by animal UUID
 *     responses:
 *       200:
 *         description: List of vaccination records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vaccinations:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Vaccination'
 *                 sucess:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 */
routes.get(
  '/vaccination',
  validateSession,
  vaccinationControllers.getAllVaccination,
);

/**
 * @swagger
 * /animals/{animalId}/vaccination:
 *   post:
 *     summary: Create a vaccination record
 *     description: |
 *       Creates a new vaccination record for a specific animal.
 *       - Requires accessToken (sent automatically in cookies), a UUID in `params`, and `vaccine` in the body.
 *     tags:
 *       - vaccination
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
 *              $ref: '#/components/schemas/bodyVaccination'
 *     responses:
 *       200:
 *         description: Vaccination record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vaccination was successfully created
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 newVaccination:
 *                    $ref: '#/components/schemas/Vaccination'
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 *       404:
 *         description: Not found. Animal id not found or not belongs to the authenticated user
 */
routes.post(
  '/:animalId/vaccination',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  validatorHandler(bodyVaccinationSchema, 'body'),
  vaccinationControllers.createVaccination,
);

/**
 * @swagger
 * /animals/vaccination/{vaccinationId}:
 *   patch:
 *     summary: Update a vaccination record
 *     description: |
 *       Updates a vaccination record by its ID.
 *       - Requires accessToken (sent automatically via cookies), vaccinationId (UUID) in `params`, and `vaccine` in the body.
 *     tags:
 *       - vaccination
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vaccinationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the vaccination record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/bodyVaccination'
 *     responses:
 *       200:
 *         description: Vaccination record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vaccination was successfully updated
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updatedVaccination:
 *                    $ref: '#/components/schemas/Vaccination'
 *       404:
 *         description: Vaccination record not found or not belongs to the user authenticated
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 */
routes.patch(
  '/vaccination/:vaccinationId',
  validateSession,
  validatorHandler(vaccinationIdSchema, 'params'),
  validatorHandler(bodyVaccinationSchema, 'body'),
  vaccinationControllers.updateVaccination,
);

/**
 * @swagger
 * /animals/vaccination/{vaccinationId}:
 *   delete:
 *     summary: Delete a vaccination record
 *     description: |
 *       Deletes a vaccination record by ID.
 *       - The record must belong to an animal owned by the authenticated user.
 *       - Requires accessToken (sent automatically via cookies).
 *     tags:
 *       - vaccination
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vaccinationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the vaccination record to delete
 *     responses:
 *       200:
 *         description: Vaccination record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vaccination was successfully deleted
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedVaccination:
 *                   type: number
 *                   example: 1
 *       401:
 *         description: Unauthorized. Access token expired, invalid or not provided
 *       404:
 *         description: Vaccination record not found or not belongs to the user authenticated
 */
routes.delete(
  '/vaccination/:vaccinationId',
  validateSession,
  validatorHandler(vaccinationIdSchema, 'params'),
  vaccinationControllers.deleteVaccination,
);

module.exports = routes;
