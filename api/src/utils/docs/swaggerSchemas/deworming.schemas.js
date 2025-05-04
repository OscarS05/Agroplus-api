/**
 * @swagger
 * components:
 *   schemas:
 *      Deworming:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            example: 9d71db0f-468b-4720-84c1-165a56c7e714
 *          dewormer:
 *            type: string
 *            example: Ivermectin 1%
 *          description:
 *            type: string
 *            example: Aplicación subcutánea para control de parásitos internos y externos.
 *          animalId:
 *            type: string
 *            example: abc-123
 *          registeredAt:
 *            type: string
 *            format: date
 *            example: 2025-04-16
 *
 *      bodySchemaDeworming:
 *        type: object
 *        required:
 *          - dewormer
 *        properties:
 *          dewormer:
 *            type: string
 *            example: Ivermectin 2%
 *          description:
 *            type: string
 *            example: Subcutaneous application for control of internal and external parasites.
 *
 */
