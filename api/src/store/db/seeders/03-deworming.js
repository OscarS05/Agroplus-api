/* eslint-disable no-param-reassign */
const { DEWORMING_TABLE } = require('../models/deworming.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(DEWORMING_TABLE, [
      // animal1
      {
        id: '9d71db0f-468b-4720-84c1-165a56c7e714',
        dewormer: 'Ivermectin 1%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: 'f4d5b562-e062-4596-adc0-ee5c79ed9d8d',
        dewormer: 'Ivermectin 2%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
        registered_at: '2025-04-23T23:40:07.036Z',
      },

      // animal2
      {
        id: '67ccb4aa-eead-4592-8371-1223b3ad5496',
        dewormer: 'Ivermectin 3%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: 'd19a5d98-e163-40fe-99ff-321d7a240636',
        dewormer: 'Ivermectin 4%',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        animal_id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
        registered_at: '2025-04-23T23:40:07.036Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(DEWORMING_TABLE, null, {});
  },
};
