const sequelize = require('../../store/db/sequelize');

const findAllAnimals = async (userId) => {
  return await sequelize.models.Animal.findAll({ where: { userId } });
}

const findOne = async (userId, animalId) => {
  return await sequelize.models.Animal.findOne({ where: { userId, id: animalId } });
}

const create = async (animalData) => {
  return await sequelize.models.Animal.create(animalData);
}

const update = async (animalId, animalData) => {
  return await sequelize.models.Animal.update(animalData, { where: { id: animalId }, returning: true });
}

const destroy = async (userId, animalId) => {
  return await sequelize.models.Animal.destroy({ where: { userId, id: animalId } });
}

module.exports = {
  findAllAnimals,
  findOne,
  create,
  update,
  destroy,
}
