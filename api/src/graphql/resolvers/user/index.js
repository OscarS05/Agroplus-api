const {
  getAll: getAllUsers,
  login,
  getByEmail,
  create: createUser,
} = require('./user.resolvers');

const query = {
  users: getAllUsers,
  user: getByEmail,
};

const mutation = {
  signUp: createUser,
  login,
};

module.exports = { query, mutation };
