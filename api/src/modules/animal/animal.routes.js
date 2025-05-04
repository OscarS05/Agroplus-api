const express = require('express');
const routes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { animalIdSchema, createAnimalsSchema, updateAnimalsSchema } = require('./animal.schemas');

const animalControllers = require('./animal.controllers');

/**
 * @swagger
 * /animals:
 *   get:
 *     summary: Get all animals belonging to the authenticated user
 *     description: |
 *       This endpoint retrieves all animals associated with the authenticated user.
 *       The authentication is handled automatically via cookies that store the access token.
 *
 *       You can also filter results by using optional query parameters (e.g., breed, livestockType, animalType, sex).
 *
 *       ### Authorization & Access Rules
 *       - A valid session (access token stored in cookies) is required.
 *       - If the session is invalid or expired, a `401 Unauthorized` error will be returned.
 *     tags:
 *       - animal
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: livestockType
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by type of livestock (e.g., Bovino)
 *       - in: query
 *         name: animalType
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by type of animal (e.g., cow)
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by animal breed
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by sex (Male or Female)
 *     responses:
 *       200:
 *         description: Animals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animals:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Animal'
 *                 sucess:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - invalid or expired session
 *       500:
 *         description: Internal server error
 */
routes.get('/',
  validateSession,
  animalControllers.getAllAnimals
);

/**
 * @swagger
 * /animals/{animalId}:
 *   get:
 *     summary: Get a specific animal by ID
 *     description: |
 *       This endpoint retrieves a specific animal that belongs to the authenticated user, using the animal's UUID.

 *       ### Authorization & Access Rules
 *       - A valid `accessToken` cookie is required (automatically handled by the system).
 *       - The token is not manually provided in the request; it's handled automatically via cookies.
 *       - If the `animalId` does not belong to the authenticated user or does not exist, a `404 Not Found` error is returned.

 *     tags:
 *       - animal
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         description: UUID of the animal to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Animal retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  animal:
 *                    $ref: '#/components/schemas/Animal'
 *                  sucess:
 *                   type: boolean
 *       401:
 *         description: Missing or invalid access token (cookie)
 *       404:
 *         description: Animal not found
 */
routes.get('/:animalId',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  animalControllers.getOneAnimal
);

/**
 * @swagger
 * /animals:
 *   post:
 *     summary: Register a new animal
 *     description: |
 *       Creates a new animal record associated with the authenticated user.

 *       ### Authorization & Access Rules
 *       - Requires a valid `accessToken` sent via cookies (handled automatically by the system).
 *       - If successful, returns the newly created animal object.
 *       - Optional fields like birth date and parent IDs can be omitted by setting the field to `null` or removing the field entirely.
 *     tags:
 *       - animal
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/createAnimal'
 *     responses:
 *       201:
 *         description: Animal was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal was successfully created
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 newAnimal:
 *                    $ref: '#/components/schemas/Animal'
 *       400:
 *         description: Validation error in request body
 *       401:
 *         description: Missing or invalid access token (cookie)
 */
routes.post('/',
  validateSession,
  validatorHandler(createAnimalsSchema, 'body'),
  animalControllers.createAnimal
);

/**
 * @swagger
 * /animals/{animalId}:
 *   patch:
 *     summary: Update an existing animal
 *     description: |
 *       Updates the data of a registered animal based on its ID.
 *       - The animal must belong to the user making the request, verified via the access token (sent automatically via cookies).
 *       - Optional fields like birth date and parent IDs can be omitted by setting the field to `null` or removing the field entirely.

 *     tags:
 *       - animal
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the animal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/updateAnimal'
 *     responses:
 *       200:
 *         description: Animal was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal was successfully updated
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updatedAnimal:
 *                    $ref: '#/components/schemas/Animal'
 *       400:
 *         description: Invalid data format
 *       401:
 *         description: Unauthorized (missing or invalid access token)
 *       404:
 *         description: Animal not found or does not belong to the user
 */
routes.patch('/:animalId',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  validatorHandler(updateAnimalsSchema, 'body'),
  animalControllers.updateAnimal
);

/**
 * @swagger
 * /animals/{animalId}:
 *   delete:
 *     summary: Delete an animal
 *     description: |
 *       Deletes a specific animal by its ID.
 *       The animal must belong to the user making the request, verified via the access token (automatically sent via cookies).
 *     tags:
 *       - animal
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the animal to delete
 *     responses:
 *       200:
 *         description: Animal was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal was successfully deleted
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedAnimal:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized (missing or invalid access token)
 *       404:
 *         description: Animal not found or does not belong to the user
 */
routes.delete('/:animalId',
  validateSession,
  validatorHandler(animalIdSchema, 'params'),
  animalControllers.deleteAnimal
);

module.exports = routes;
