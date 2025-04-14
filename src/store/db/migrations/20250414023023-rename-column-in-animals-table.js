'use strict';

const { ANIMAL_TABLE } = require('../models/animals.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(ANIMAL_TABLE, 'name', 'breed');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(ANIMAL_TABLE, 'breed', 'name');
  }
};
