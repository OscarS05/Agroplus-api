/**
 * @swagger
 * components:
 *   schemas:
 *
 *      Note:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            example: f42db923-7c41-4b11-ba2e-dbf7638cacae
 *          title:
 *            type: string
 *            example: Deworming of pigs
 *          description:
 *            type: string
 *            example: Some description
 *          userId:
 *            type: string
 *            format: uuid
 *          user:
 *            type: string
 *            example: Juanita
 *          createdAt:
 *            type: string
 *            format: date
 *            example: 2025-04-16
 *
 *      bodyNote:
 *        type: object
 *        required:
 *          - title
 *        properties:
 *          title:
 *            type: string
 *            example: Pigs need to be purged
 *          description:
 *            type: string
 *            example: Some description
 *
 */
