const {
  getAll: getAllAnimals,
  getById: getAnimalById,
  create: createAnimal,
  update: updateAnimal,
  destroy: deleteAnimal,
} = require('./animal.resolvers');

const query = {
  animals: getAllAnimals,
  animal: getAnimalById,
};

const mutation = {
  createAnimal,
  updateAnimal,
  deleteAnimal,
};

module.exports = { query, mutation };
