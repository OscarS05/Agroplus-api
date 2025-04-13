const sequelize = require('../../store/db/sequelize');

const findOne = async (userId) => {
  return await sequelize.models.User.findOne({ where: { id: userId } });
}

const create = async (userId) => {
  // return await sequelize.models.User.findOne({ where: { id: userId } });
}

module.exports = {
  findOne,
  create,
}
