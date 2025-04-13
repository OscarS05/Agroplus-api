const sequelize = require('../../store/db/sequelize');

const findAllUsers = async () => {
  return await sequelize.models.User.findAll({ attributes:  { exclude: ['password'] }});
}

const findOne = async (userId) => {
  return await sequelize.models.User.findByPk(userId, { attributes:  { exclude: ['password'] }});
}

const findOneByEmail = async (email) => {
  return await sequelize.models.User.findOne({ where: { email }, attributes:  { exclude: ['password'] }});
}

const findOneByEmailToLogin = async (email) => {
  return await sequelize.models.User.findOne({ where: { email }});
}

const create = async (userData) => {
  return await sequelize.models.User.create(userData, { attributes:  { exclude: ['password'] }});
}

module.exports = {
  findAllUsers,
  findOne,
  findOneByEmail,
  create,
  findOneByEmailToLogin,
}
