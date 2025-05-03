const express = require('express');
const routes = express.Router();
const authRoutes = express.Router();

const { validateSession } = require('../../middlewares/authentication');
const { validatorHandler } = require('../../middlewares/validator.handler');
const { userEmailSchema, signUpSchema, loginSchema } = require('./user.schemas');

const userControllers = require('./user.controllers');

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users in the system
 *     description: |
 *       This endpoint retrieves all registered users in the system.
 *       It returns an array with user information such as ID, name, email, role, and creation date.
 *
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
routes.get('/',
  validateSession,
  userControllers.getAllUsers
);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Get a single user by email
 *     description: |
 *       This endpoint retrieves a specific user from the system using their unique email.
 *
 *       ### Authorization & Access Rules
 *
 *       - A valid Bearer token is required.
 *       - Only authenticated users can access this endpoint.
 *       - If the user is not found, a `404 Not Found` error will be returned.
 *       - If there is an internal server error, a `500 Internal Server Error` will be returned.
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: The user's email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    user:
 *                        $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
routes.get('/:email',
  validateSession,
  validatorHandler(userEmailSchema, 'params'),
  userControllers.getOneUser
);

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUp'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
authRoutes.post('/sign-up',
  validatorHandler(signUpSchema, 'body'),
  userControllers.createUser
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: |
 *       This endpoint authenticates a user with their email and password.
 *       If the credentials are valid, it returns a JWT access token.
 *
 *       ### Authorization & Access Rules
 *       - No token is required to access this endpoint.
 *       - Email and password must match an existing user.
 *       - If authentication fails, a `401 Unauthorized` error will be returned.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/loginResponse'
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
authRoutes.post('/login',
  validatorHandler(loginSchema, 'body'),
  userControllers.login
);

module.exports = { routes, authRoutes };
