const Boom = require('@hapi/boom');

const { findOne } = require('./user.repository');

const getUser = async (userId) => {
  return await findOne(userId);
}

module.exports = {
  getUser,
}
