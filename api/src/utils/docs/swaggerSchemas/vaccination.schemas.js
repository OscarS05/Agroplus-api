/**
 * @swagger
 * components:
 *   schemas:
 *
 *      Vaccination:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *          vaccine:
 *            type: string
 *            example: Parainfluenza 3 (PI3)
 *          description:
 *            type: string
 *            example: 1 dose. The 2nd dose should be administered within 15 days.
 *          animal:
 *            type: string
 *            example: BOV-123
 *          registeredAt:
 *            type: string
 *            format: date
 *
 *      bodyVaccination:
 *        type: object
 *        required:
 *          - vaccine
 *        properties:
 *          vaccine:
 *            type: string
 *            example: Parainfluenza 3 (PI3)
 *          description:
 *            type: string
 *            example: Some description.
 *
 */
