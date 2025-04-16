const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');

const animalRepository = require('./animal.repository');

const getAllAnimals = async (filters) => {
  const animals = await animalRepository.findAllAnimals(filters);
  if(!animals?.length) return [];

  return animals.map(animal => formatData(animal));
}

const formatData = (animalData) => {
  return {
    id: animalData.id,
    livestockType: animalData.livestockType,
    animalType: animalData.animalType,
    breed: animalData?.breed || null,
    code: animalData.code,
    sex: animalData.sex,
    mother: animalData.mother ? animalData.mother.code : null,
    father: animalData.father ? animalData.father.code : null,
    birthDate: animalData?.birthDate || null,
    registeredAt: new Date().toISOString().split('T')[0],
  }
}

const getAnimal = async (userId, animalId) => {
  const animal = await animalRepository.findOne(userId, animalId);
  if(!animal?.id) throw Boom.notFound('Animal does not exist');
  return formatData(animal);
}

const createAnimal = async (animalData) => {
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
  }

  const newAnimal = await animalRepository.create(animal);
  if(!newAnimal?.id) throw Boom.badRequest('Something went wrong creating the animal');
  return newAnimal;
}

const updateAnimal = async (userId, animalId, animalData) => {
  const animal = await animalRepository.findOne(userId, animalId);
  if(!animal?.id) throw Boom.conflict('Animal does not exists');

  const formattedAnimalData = {
    ...(animalData.livestockType && { livestockType: animalData.livestockType }),
    ...(animalData.animalType && { animalType: animalData.animalType }),
    ...(animalData.code && { code: animalData.code }),
    ...(animalData.breed && { breed: animalData.breed }),
    ...(animalData.sex && { sex: animalData.sex }),
    ...(animalData.motherId && { motherId: animalData.motherId }),
    ...(animalData.fatherId && { fatherId: animalData.fatherId }),
  };
  const [ updatedRows, [ updatedAnimal ]] = await animalRepository.update(animalId, formattedAnimalData);
  if(!updatedAnimal?.id) throw Boom.badRequest('Something went wrong creating the animal');
  return updatedAnimal;
}

const deleteAnimal = async (userId, animalId) => {
  return await animalRepository.destroy(userId, animalId);
}

module.exports = {
  getAllAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
}
