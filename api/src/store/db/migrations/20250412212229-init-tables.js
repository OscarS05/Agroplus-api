'use strict';

 const { USER_TABLE } = require('../models/user.model');
 const { ANIMAL_TABLE } = require('../models/animals.model');
 const { DEWORMING_TABLE } = require('../models/deworming.model');
 const { VACCINATION_TABLE } = require('../models/vaccination.model');
 const { NOTES_TABLE } = require('../models/notes.model');

 module.exports = {
   async up (queryInterface, Sequelize) {
     await queryInterface.createTable(USER_TABLE, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true,
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING
        },
        role: {
          allowNull: false,
          type: Sequelize.STRING,
          defaultValue: 'basic'
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
        }
     });

     await queryInterface.createTable(ANIMAL_TABLE, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        livestockType: {
          field: 'livestock_type',
          allowNull: false,
          type: Sequelize.STRING,
        },
        animalType: {
          field: 'animal_type',
          allowNull: false,
          type: Sequelize.STRING,
        },
        code: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        breed: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        sex: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        registeredAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'registered_at',
          defaultValue: Sequelize.NOW
        },
        birthDate: {
          allowNull: true,
          type: Sequelize.DATE,
          field: 'birth_date',
          defaultValue: Sequelize.NOW
        },
        motherId: {
          field: 'mother_id',
          allowNull: true,
          type: Sequelize.UUID,
          references: {
            model: ANIMAL_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        fatherId: {
          field: 'father_id',
          allowNull: true,
          type: Sequelize.UUID,
          references: {
            model: ANIMAL_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        userId: {
          field: 'user_id',
          allowNull: true,
          type: Sequelize.UUID,
          references: {
            model: USER_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        }
     });

     await queryInterface.createTable(DEWORMING_TABLE, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        dewormer: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        animalId: {
          field: 'animal_id',
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: ANIMAL_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        registeredAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'registered_at',
          defaultValue: Sequelize.NOW
        },
     });

     await queryInterface.createTable(VACCINATION_TABLE, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        vaccine: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        animalId: {
          field: 'animal_id',
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: ANIMAL_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        registeredAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'registered_at',
          defaultValue: Sequelize.NOW
        },
     });

     await queryInterface.createTable(NOTES_TABLE, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        title: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        description: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        userId: {
          field: 'user_id',
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: USER_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
        },
     });
   },

   async down (queryInterface, Sequelize) {
     await queryInterface.dropTable(NOTES_TABLE);
     await queryInterface.dropTable(VACCINATION_TABLE);
     await queryInterface.dropTable(DEWORMING_TABLE);
     await queryInterface.dropTable(ANIMAL_TABLE);
     await queryInterface.dropTable(USER_TABLE);
   }
 };
