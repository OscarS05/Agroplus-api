/* eslint-disable no-param-reassign */
const { NOTES_TABLE } = require('../models/notes.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(NOTES_TABLE, [
      // user1
      {
        id: 'daa915c2-192d-43b5-930d-88596673c6e0',
        title: 'task 1',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        created_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: 'd1ab577c-1ea3-4ec4-9140-5ec1cf154979',
        title: 'task 2',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        created_at: '2025-04-23T23:40:07.036Z',
      },

      // user2
      {
        id: '972bfd24-f748-4739-ae11-f1fa28db920d',
        title: 'task 3',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        user_id: '81f72543-69d9-4764-9b73-57e0cf785731',
        created_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '488e4b26-a181-45b7-9ba5-54ecabbb4623',
        title: 'task 4',
        description:
          'Subcutaneous application for control of internal and external parasites.',
        user_id: '81f72543-69d9-4764-9b73-57e0cf785731',
        created_at: '2025-04-23T23:40:07.036Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(NOTES_TABLE, null, {});
  },
};
