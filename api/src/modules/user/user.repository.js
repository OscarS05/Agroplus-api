const sequelize = require('../../store/db/sequelize');

const findAllUsers = async () => {
  return sequelize.models.User.findAll({
    attributes: { exclude: ['password', 'token'] },
  });
};

const findOne = async (userId) => {
  return sequelize.models.User.findOne(
    { where: { id: userId } },
    { attributes: { exclude: ['password', 'token'] } },
  );
};

const findOneToValidateSession = async (userId, token) => {
  return sequelize.models.User.findOne(
    { where: { id: userId, token } },
    { attributes: { exclude: ['password', 'token'] } },
  );
};

const findOneByEmail = async (email) => {
  return sequelize.models.User.findOne({
    where: { email },
    attributes: { exclude: ['password', 'token'] },
  });
};

const findOneByEmailToLogin = async (email) => {
  return sequelize.models.User.findOne({
    where: { email },
    attributes: { exclude: ['token'] },
  });
};

const create = async (userData) => {
  return sequelize.models.User.create(userData, {
    attributes: { exclude: ['password', 'token'] },
  });
};

const update = async (userId, userData) => {
  return sequelize.models.User.update(userData, {
    where: { id: userId },
  });
};

module.exports = {
  findAllUsers,
  findOne,
  findOneByEmail,
  create,
  findOneByEmailToLogin,
  update,
  findOneToValidateSession,
};
