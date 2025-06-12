/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt');

const { USER_TABLE } = require('../models/user.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    const hash = (password) => bcrypt.hash(password, 10);

    return queryInterface.bulkInsert(USER_TABLE, [
      {
        id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        email: 'user1@email.com',
        name: 'user1',
        password: await hash('Admin123@'),
        token: null,
        role: 'admin',
        created_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '81f72543-69d9-4764-9b73-57e0cf785731',
        email: 'user2@email.com',
        name: 'user2',
        password: await hash('Customer123@'),
        token: null,
        role: 'basic',
        created_at: '2025-04-23T23:40:07.036Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  },
};
