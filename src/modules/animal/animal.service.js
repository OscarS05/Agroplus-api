const Boom = require('@hapi/boom');

const animalRepository = require('./animal.repository');

const getAllAnimals = async (userId) => {
  return await animalRepository.findAllAnimals(userId);
}

const getAnimal = async (userId, animalId) => {
  const animal = await animalRepository.findOne(userId, animalId);
  if(!animal?.id) throw Boom.notFound('Animal does not exist');
  return animal;
}

const createAnimal = async (animalData) => {
  const animal = {
    livestockType: animalData.livestockType,
    animalType: animalData.animalType,
    code: animalData.code,
    breed: animalData?.breed || null,
    sex: animalData.sex,
    userId: animalData.userId,
    motherId: animalData?.motherId || null,
    fatherId: animalData?.fatherId || null,
    birthDate: animalData?.birthDate || null,
    registeredAt: new Date().toISOString(),
  }

  const newAnimal = await animalRepository.create(animal);
  if(!newAnimal?.id) throw Boom.badRequest('Something went wrong creating the animal');
  return newAnimal;
}

const updateAnimal = async (userId, animalId, animalData) => {
  const animal = await animalRepository.findOne(userId, animalId);
  if(!animal?.id) throw Boom.conflict('Animal does not exists');

  const formattedAnimalData = {
    livestockType: animalData.livestockType,
    animalType: animalData.animalType,
    code: animalData.code || null,
    breed: animalData?.breed || null,
    sex: animalData?.sex || null,
    motherId: animalData?.motherId || null,
    fatherId: animalData?.fatherId || null,
  }

  Object.keys(formattedAnimalData).forEach(key => {
    if (formattedAnimalData[key] === null) {
      delete formattedAnimalData[key];
    }
  });

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
