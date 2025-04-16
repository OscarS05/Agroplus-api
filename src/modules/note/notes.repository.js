// const sequelize = require('../../store/db/sequelize');

// const findAllDewormings = async (userId, filters) => {
//   return await sequelize.models.Deworming.findAll({
//     where: filters,
//     include: [
//       {
//         model: sequelize.models.Animal,
//         as: 'animal',
//         attributes: ['id', 'code', 'breed'],
//         where: { userId },
//       },
//     ],
//   });
// }

// const findOne = async (userId, dewormingId) => {
//   return await sequelize.models.Deworming.findOne({
//     where: { id: dewormingId },
//     include: [{
//       model: sequelize.models.Animal,
//       as: 'animal',
//       attributes: ['id', 'code', 'breed'],
//       where: { userId },
//     }]
//   });
// }

// const create = async (dewormingData) => {
//   return await sequelize.models.Deworming.create(dewormingData);
// }

// const update = async (animalId, dewormingData) => {
//   return await sequelize.models.Deworming.update(dewormingData, { where: { id: animalId }, returning: true });
// }

// const destroy = async (dewormingId) => {
//   return await sequelize.models.Deworming.destroy({ where: { id: dewormingId } });
// }

// module.exports = {
//   findAllDewormings,
//   findOne,
//   create,
//   update,
//   destroy,
// }
