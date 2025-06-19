const {
  getAllUsers,
  login: loginUser,
  getUserByEmail,
  createUser,
} = require('../../../modules/user/user.service');
const {
  validateGraphQLSession,
} = require('../../../middlewares/authentication');

const getAll = async (_, __, context) => {
  await validateGraphQLSession(context.req);

  return getAllUsers();
};

const getByEmail = async (_, { email }, context) => {
  await validateGraphQLSession(context.req);

  const user = await getUserByEmail(email);
  return user;
};

const create = async (_, { name, email, password }) => {
  return createUser({ name, email, password });
};

const login = async (_, { email, password }) => {
  return loginUser({ email, password });
};

module.exports = {
  getAll,
  getByEmail,
  login,
  create,
};
