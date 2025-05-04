/**
 * @swagger
 * components:
 *   schemas:
 *      Animal:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *          livestockType:
 *            type: string
 *            example: Bovine
 *          animalType:
 *            type: string
 *            example: Cow
 *          breed:
 *            type: string
 *            example: Angus
 *          code:
 *            type: string
 *            example: ABC-123
 *          sex:
 *            type: string
 *            example: Male
 *          mother:
 *            type: string
 *            nullable: true
 *          father:
 *            type: string
 *            nullable: true
 *          birthDate:
 *            type: string
 *            format: date
 *            nullable: true
 *          registeredAt:
 *            type: string
 *            format: date
 *
 *      createAnimal:
 *        type: object
 *        required:
 *          - livestockType
 *          - animalType
 *          - breed
 *          - code
 *          - sex
 *        properties:
 *          livestockType:
 *            type: string
 *            example: Bovine
 *          animalType:
 *            type: string
 *            example: Cow
 *          breed:
 *            type: string
 *            example: Angus
 *          code:
 *            type: string
 *            example: BOV-001
 *          sex:
 *            type: string
 *            enum: [Male, Female]
 *          motherId:
 *            type: string
 *            nullable: true
 *            format: uuid
 *          fatherId:
 *            type: string
 *            nullable: true
 *            format: uuid
 *          birthDate:
 *            type: string
 *            format: date
 *            nullable: true
 *
 *      updateAnimal:
 *        type: object
 *        required:
 *          - livestockType
 *          - animalType
 *        properties:
 *          livestockType:
 *            type: string
 *            example: Bovino
 *          animalType:
 *            type: string
 *            example: Vaca
 *          breed:
 *            type: string
 *            example: Angus
 *          code:
 *            type: string
 *            example: BAV-111
 *          sex:
 *            type: string
 *            example: Male
 *          motherId:
 *            type: string
 *            format: uuid
 *            example: "null"
 *          fatherId:
 *            type: string
 *            format: uuid
 *            example: "null"
 *          birthDate:
 *            type: string
 *            format: date
 *            example: 2025-04-01
 *
 */
