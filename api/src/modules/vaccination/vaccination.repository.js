const sequelize = require('../../store/db/sequelize');

const findAllVaccinations = async (userId, filters) => {
  return await sequelize.models.Vaccination.findAll({
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
}

const findOne = async (userId, vaccinationId) => {
  return await sequelize.models.Vaccination.findOne({
    where: { id: vaccinationId },
    include: [{
      model: sequelize.models.Animal,
      as: 'animal',
      attributes: ['id', 'code', 'breed'],
      where: { userId },
    }]
  });
}

const create = async (vaccinationData) => {
  return await sequelize.models.Vaccination.create(vaccinationData);
}

const update = async (animalId, vaccinationData) => {
  return await sequelize.models.Vaccination.update(vaccinationData, { where: { id: animalId }, returning: true });
}

const destroy = async (vaccinationId) => {
  return await sequelize.models.Vaccination.destroy({ where: { id: vaccinationId } });
}

module.exports = {
  findAllVaccinations,
  findOne,
  create,
  update,
  destroy,
}
