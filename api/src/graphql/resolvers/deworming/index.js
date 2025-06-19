const {
  getAll: getAllDewormings,
  getById: getDewormingById,
  create: createDeworming,
  update: updateDeworming,
  destroy: deleteDeworming,
} = require('./deworming.resolvers');

const query = {
  dewormings: getAllDewormings,
  deworming: getDewormingById,
};

const mutation = {
  createDeworming,
  updateDeworming,
  deleteDeworming,
};

module.exports = { query, mutation };
