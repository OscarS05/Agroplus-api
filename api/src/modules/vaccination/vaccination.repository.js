const sequelize = require('../../store/db/sequelize');

const findAllVaccinations = async (userId, filters) => {
  return sequelize.models.Vaccination.findAll({
    where: filters,
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

const findOne = async (userId, vaccinationId) => {
  return sequelize.models.Vaccination.findOne({
    where: { id: vaccinationId },
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

const create = async (vaccinationData) => {
  return sequelize.models.Vaccination.create(vaccinationData);
};

const update = async (animalId, vaccinationData) => {
  return sequelize.models.Vaccination.update(vaccinationData, {
    where: { id: animalId },
    returning: true,
  });
};

const destroy = async (vaccinationId) => {
  return sequelize.models.Vaccination.destroy({
    where: { id: vaccinationId },
  });
};

module.exports = {
  findAllVaccinations,
  findOne,
  create,
  update,
  destroy,
};
