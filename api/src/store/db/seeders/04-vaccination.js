/* eslint-disable no-param-reassign */
const { VACCINATION_TABLE } = require('../models/vaccination.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(VACCINATION_TABLE, [
      // User 1
      // animal1
      {
        id: 'daa915c2-192d-43b5-930d-88596673c6e0',
        vaccine: 'Ivermectin 1%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: 'd1ab577c-1ea3-4ec4-9140-5ec1cf154979',
        vaccine: 'Ivermectin 2%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
        registered_at: '2025-04-23T23:40:07.036Z',
      },

      // animal2
      {
        id: '972bfd24-f748-4739-ae11-f1fa28db920d',
        vaccine: 'Ivermectin 3%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '488e4b26-a181-45b7-9ba5-54ecabbb4623',
        vaccine: 'Ivermectin 4%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
        registered_at: '2025-04-23T23:40:07.036Z',
      },

      // User 2
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(VACCINATION_TABLE, null, {});
  },
};
