const sequelize = require('../../store/db/sequelize');

const findAllDewormings = async (userId, { where, limit, offset }) => {
  return sequelize.models.Deworming.findAll({
    where,
    limit,
    offset,
    include: [
      {
        model: sequelize.models.Animal,
        as: 'animal',
        attributes: ['id', 'code', 'breed'],
        where: { userId },
      },
    ],
  });
};

const findOne = async (userId, dewormingId) => {
  return sequelize.models.Deworming.findOne({
    where: { id: dewormingId },
    include: [
      {
        model: sequelize.models.Animal,
        as: 'animal',
        attributes: ['id', 'code', 'breed'],
        where: { userId },
      },
    ],
  });
};

const create = async (dewormingData) => {
  return sequelize.models.Deworming.create(dewormingData);
};

const update = async (animalId, dewormingData) => {
  return sequelize.models.Deworming.update(dewormingData, {
    where: { id: animalId },
    returning: true,
  });
};

const destroy = async (dewormingId) => {
  return sequelize.models.Deworming.destroy({
    where: { id: dewormingId },
  });
};

module.exports = {
  findAllDewormings,
  findOne,
  create,
  update,
  destroy,
};
