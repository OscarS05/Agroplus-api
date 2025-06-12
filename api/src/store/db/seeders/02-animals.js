/* eslint-disable no-param-reassign */
const { ANIMAL_TABLE } = require('../models/animals.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(ANIMAL_TABLE, [
      // User1
      // animal1
      {
        id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
        livestock_type: 'Bovino',
        animal_type: 'Cow',
        breed: 'Angus',
        code: 'ABC-123',
        sex: 'Male',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        mother_id: null,
        father_id: null,
        birth_date: null,
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      // animal2
      {
        id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
        livestock_type: 'Bovino',
        animal_type: 'Cow',
        breed: 'Angus',
        code: 'DFE-123',
        sex: 'Female',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        mother_id: null,
        father_id: null,
        birth_date: null,
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '43373730-464c-481d-bc41-37dbac74046a',
        livestock_type: 'Bovino',
        animal_type: 'Cow',
        breed: 'Angus',
        code: 'DFE-123',
        sex: 'Female',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        mother_id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
        father_id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
        birth_date: '2025-04-23T23:40:07.036Z',
        registered_at: '2025-04-23T23:40:07.036Z',
      },

      // User2
      {
        id: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
        livestock_type: 'Bovino',
        animal_type: 'Cow',
        breed: 'Angus',
        code: 'ABC-123',
        sex: 'Male',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        mother_id: null,
        father_id: null,
        birth_date: null,
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: 'a2500a46-5e70-4835-a6e6-f7cf23982d64',
        livestock_type: 'Bovino',
        animal_type: 'Cow',
        breed: 'Angus',
        code: 'DFE-123',
        sex: 'Female',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        mother_id: null,
        father_id: null,
        birth_date: null,
        registered_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '6cc1432a-6407-4454-b252-4432bb7270ea',
        livestock_type: 'Bovino',
        animal_type: 'Cow',
        breed: 'Angus',
        code: 'DFE-123',
        sex: 'Female',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        mother_id: 'a2500a46-5e70-4835-a6e6-f7cf23982d64',
        father_id: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
        birth_date: '2025-04-23T23:40:07.036Z',
        registered_at: '2025-04-23T23:40:07.036Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(ANIMAL_TABLE, null, {});
  },
};
