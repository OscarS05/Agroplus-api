/**
 * @swagger
 * components:
 *   schemas:
 *     login:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            example: juanita@email.com
 *          password:
 *            type: string
 *            example: Passw0rd@
 *
 *     SignUp:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The username of the user
 *           example: Juanita
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *           example: juanita@email.com
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *           example: Passw0rd@
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the user
 *         name:
 *           type: string
 *           description: The username of the user
 *           example: Juanita
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: juanita@email.com
 *         role:
 *           type: string
 *           example: basic
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-13T18:16:12.714Z
 *
 *     loginResponse:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            example: User authenticated successfully
 *          success:
 *            type: boolean
 *            example: true
 *
 */
