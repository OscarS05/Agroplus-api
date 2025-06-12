const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const animalRepository = require('./animal.repository');

const formatData = (animalData) => {
  return {
    id: animalData.id,
    livestockType: animalData.livestockType,
    animalType: animalData.animalType,
    breed: animalData?.breed || null,
    code: animalData.code,
    sex: animalData.sex,
    user: { id: animalData.user.id, name: animalData.user.name },
    mother: animalData.mother ? animalData.mother.code : null,
    father: animalData.father ? animalData.father.code : null,
    birthDate: animalData?.birthDate || null,
    registeredAt: new Date().toISOString().split('T')[0],
  };
};

const buildFilters = (query) => {
  const { code, livestockType, animalType, breed, sex, animalId, userId } =
    query;

  return {
    userId,
    ...(animalId && { id: animalId }),
    ...(code && { code: code.toUpperCase() }),
    ...(livestockType && {
      livestockType: { [Op.iLike]: `%${livestockType}%` },
    }),
    ...(animalType && { animalType: { [Op.iLike]: `%${animalType}%` } }),
    ...(breed && { breed: { [Op.iLike]: `%${breed}%` } }),
    ...(sex && { sex }),
  };
};

const getAllAnimals = async (query) => {
  if (!query || typeof query !== 'object') {
    throw Boom.badRequest('query was not provided');
  }

  const filters = buildFilters(query);

  const animals = await animalRepository.findAllAnimals(filters);
  if (!animals?.length === 0) return [];

  return animals.map((animal) => formatData(animal));
};

const getAnimal = async (userId, animalId) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!animalId) throw Boom.badRequest('animalId was not provided');

  const animal = await animalRepository.findOne(userId, animalId);
  if (!animal?.id) throw Boom.notFound('Animal does not exist');

  return formatData(animal);
};

const validateParents = async (userId, { fatherId, motherId }) => {
  const parents = [];

  if (fatherId) parents.push({ id: fatherId, label: 'father' });
  if (motherId) parents.push({ id: motherId, label: 'mother' });

  await Promise.all(
    parents.map((parent) =>
      getAnimal(userId, parent.id).catch(() => {
        throw Boom.badRequest(
          `The ${parent.label} to the new animal does not exist`,
        );
      }),
    ),
  );
};

const createAnimal = async (animalData) => {
  if (
    !animalData?.livestockType ||
    !animalData?.animalType ||
    !animalData?.code ||
    !animalData?.breed ||
    !animalData?.sex ||
    !animalData?.userId
  ) {
    throw Boom.badRequest('Some values were not provided');
  }

  if (animalData?.fatherId || animalData?.motherId) {
    await validateParents(animalData.userId, {
      fatherId: animalData.fatherId,
      motherId: animalData.motherId,
    });
  }

  const animal = {
    id: uuidv4(),
    livestockType: animalData.livestockType,
    animalType: animalData.animalType,
    code: animalData.code,
    breed: animalData?.breed || null,
    sex: animalData.sex,
    userId: animalData.userId,
    motherId: animalData?.motherId || null,
    fatherId: animalData?.fatherId || null,
    birthDate: animalData?.birthDate || null,
    registeredAt: new Date().toISOString().split('T')[0],
  };

  const newAnimal = await animalRepository.create(animal);
  if (!newAnimal?.id)
    throw Boom.badRequest('Something went wrong creating the animal');
  return newAnimal;
};

const updateAnimal = async (userId, animalId, animalData) => {
  const animal = await animalRepository.findOne(userId, animalId);
  if (!animal?.id)
    throw Boom.conflict(
      'Animal does not exists or does not belong to the user',
    );

  if (Object.entries(animalData).length === 0) {
    throw Boom.badRequest('No data was provided to update the animal');
  }

  if (animalData?.fatherId || animalData?.motherId) {
    await validateParents(animalData.userId, {
      fatherId: animalData?.fatherId,
      motherId: animalData?.motherId,
    });
  }

  const formattedAnimalData = {
    ...(animalData.livestockType && {
      livestockType: animalData.livestockType,
    }),
    ...(animalData.animalType && { animalType: animalData.animalType }),
    ...(animalData.code && { code: animalData.code }),
    ...(animalData.breed && { breed: animalData.breed }),
    ...(animalData.sex && { sex: animalData.sex }),
    ...(animalData.motherId && { motherId: animalData.motherId }),
    ...(animalData.fatherId && { fatherId: animalData.fatherId }),
  };

  if (Object.keys(formattedAnimalData).length === 0) {
    throw Boom.badRequest('There is no data to update');
  }

  const [updatedRows, [updatedAnimal]] = await animalRepository.update(
    animalId,
    formattedAnimalData,
  );
  if (updatedRows === 0) {
    throw Boom.badRequest('Something went wrong creating the animal');
  }
  return updatedAnimal;
};

const deleteAnimal = async (userId, animalId) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!animalId) throw Boom.badRequest('animalId was not provided');

  const deletedRows = await animalRepository.destroy(userId, animalId);

  if (deletedRows === 0) {
    throw Boom.badRequest(
      'Something went wrong deleting the animal or the animal does not exist',
    );
  }

  return deletedRows;
};

module.exports = {
  getAllAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};
