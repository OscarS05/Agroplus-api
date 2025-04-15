'use strict';

const { VACCINATION_TABLE } = require('../models/vaccination.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(VACCINATION_TABLE, 'vacuna', 'vaccine');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(VACCINATION_TABLE, 'vaccine', 'vacuna');
  }
};
