const sequelize = require('../../store/db/sequelize');

const findAllAnimals = async (filters) => {
  return await sequelize.models.Animal.findAll({
    where: filters,
    include: [
      {
        model: sequelize.models.Animal,
        as: 'mother',
        attributes: ['id', 'code', 'breed'],
      },
      {
        model: sequelize.models.Animal,
        as: 'father',
        attributes: ['id', 'code', 'breed'],
      },
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'name'],
      }
    ]
  });
}

const findOne = async (userId, animalId) => {
  return await sequelize.models.Animal.findOne({
    where: { userId, id: animalId },
    include: [
      {
        model: sequelize.models.Animal,
        as: 'mother',
        attributes: ['id', 'code', 'breed'],
      },
      {
        model: sequelize.models.Animal,
        as: 'father',
        attributes: ['id', 'code', 'breed'],
      },
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'name'],
      }
    ]
  });
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
