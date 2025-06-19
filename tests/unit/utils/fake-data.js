function user1(options = {}) {
  return {
    id: '44c5da38-bb82-4659-b84a-f6be63e300fc',
    name: 'user1',
    email: 'user1@email.com',
    role: 'admin',
    createdAt: '2025-04-13T18:16:12.714Z',
    ...options,
  };
}

function user2(options = {}) {
  return {
    id: '6cc1432a-6407-4454-b252-4432bb7270ea',
    name: 'user2',
    email: 'user2@email.com',
    role: 'basic',
    createdAt: '2025-04-13T18:16:12.714Z',
    ...options,
  };
}

function animal1(options = {}) {
  return {
    id: 'd0759f76-a119-4be0-ad33-e93595f56be8',
    livestockType: 'Bovino',
    animalType: 'Cow',
    breed: 'Angus',
    code: 'ABC-123',
    sex: 'Male',
    userId: '44c5da38-bb82-4659-b84a-f6be63e300fc',
    user: {
      id: '44c5da38-bb82-4659-b84a-f6be63e300fc',
      name: 'user1',
    },
    motherId: null,
    fatherId: null,
    birthDate: null,
    registeredAt: new Date(),
    ...options,
  };
}

function animal2(options = {}) {
  return {
    id: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
    livestockType: 'Bovino',
    animalType: 'Cow',
    breed: 'Angus',
    code: 'DFE-123',
    sex: 'Female',
    userId: '44c5da38-bb82-4659-b84a-f6be63e300fc',
    user: {
      id: '44c5da38-bb82-4659-b84a-f6be63e300fc',
      name: 'user1',
    },
    motherId: null,
    fatherId: null,
    birthDate: null,
    registeredAt: new Date(),
    ...options,
  };
}

function animal3(options = {}) {
  return {
    id: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
    livestockType: 'Bovino',
    animalType: 'Cow',
    breed: 'Angus',
    code: 'HIJ-123',
    sex: 'Female',
    userId: '44c5da38-bb82-4659-b84a-f6be63e300fc',
    user: {
      id: '44c5da38-bb82-4659-b84a-f6be63e300fc',
      name: 'user1',
    },
    motherId: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
    fatherId: 'd0759f76-a119-4be0-ad33-e93595f56be8',
    birthDate: new Date(),
    registeredAt: new Date(),
    ...options,
  };
}

function animal4(options = {}) {
  return {
    id: 'a2500a46-5e70-4835-a6e6-f7cf23982d64',
    livestockType: 'Bovino',
    animalType: 'Cow',
    breed: 'Angus',
    code: 'KLM-123',
    sex: 'Female',
    userId: '6cc1432a-6407-4454-b252-4432bb7270ea',
    user: {
      id: '6cc1432a-6407-4454-b252-4432bb7270ea',
      name: 'user2',
    },
    motherId: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
    fatherId: 'd0759f76-a119-4be0-ad33-e93595f56be8',
    birthDate: new Date(),
    registeredAt: new Date(),
    ...options,
  };
}

function deworming1(options = {}) {
  return {
    id: '9d71db0f-468b-4720-84c1-165a56c7e714',
    dewormer: 'Ivermectin 1%',
    description:
      'Subcutaneous application for control of internal and external parasites.',
    animalId: 'd0759f76-a119-4be0-ad33-e93595f56be8',
    registeredAt: new Date(),
    ...options,
  };
}

function deworming2(options = {}) {
  return {
    id: 'f4d5b562-e062-4596-adc0-ee5c79ed9d8d',
    dewormer: 'Ivermectin 1%',
    description:
      'Subcutaneous application for control of internal and external parasites.',
    animalId: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
    registeredAt: new Date(),
    ...options,
  };
}

function deworming3(options = {}) {
  return {
    id: 'f4d5b562-e062-4596-adc0-ee5c79ed9d8d',
    dewormer: 'Ivermectin 1%',
    description:
      'Subcutaneous application for control of internal and external parasites.',
    animalId: 'a2500a46-5e70-4835-a6e6-f7cf23982d64',
    registeredAt: new Date(),
    ...options,
  };
}

function vaccination1(options = {}) {
  return {
    id: 'f4d5b562-e062-4596-adc0-ee5c79ed9d8d',
    vaccine: 'Ivermectin 0.5%',
    description: 'Description 1',
    animalId: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
    registeredAt: new Date(),
    ...options,
  };
}

function vaccination2(options = {}) {
  return {
    id: 'd1ab577c-1ea3-4ec4-9140-5ec1cf154979',
    vaccine: 'Ivermectin 0.5%',
    description: 'Description 1',
    animalId: 'a2500a46-5e70-4835-a6e6-f7cf23982d64',
    registeredAt: new Date(),
    ...options,
  };
}

function note1(options = {}) {
  return {
    id: 'f42db923-7c41-4b11-ba2e-dbf7638cacae',
    title: 'user note 1',
    description: 'Description 1',
    userId: '44c5da38-bb82-4659-b84a-f6be63e300fc',
    createdAt: new Date(),
    ...options,
  };
}

function note2(options = {}) {
  return {
    id: 'c70bf632-f6f7-4421-8d00-e5bc58b5702b',
    title: 'user note 2',
    description: 'Description 2',
    userId: '6cc1432a-6407-4454-b252-4432bb7270ea',
    createdAt: new Date(),
    ...options,
  };
}

module.exports = {
  user1,
  user2,
  animal1,
  animal2,
  animal3,
  animal4,
  deworming1,
  deworming2,
  deworming3,
  vaccination1,
  vaccination2,
  note1,
  note2,
};
