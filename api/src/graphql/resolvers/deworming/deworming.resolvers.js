const {
  getAllDeworming,
  getDeworming,
  createDeworming,
  updateDeworming,
  deleteDeworming,
} = require('../../../modules/deworming/deworming.service');
const {
  validateGraphQLSession,
} = require('../../../middlewares/authentication');

const getAll = async (_, { query = {} }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getAllDeworming(user.id, query);
};

const getById = async (_, { id: dewormingId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getDeworming(user.id, dewormingId);
};

const create = async (_, { input }, context) => {
  const user = await validateGraphQLSession(context.req);

  return createDeworming(user.id, input);
};

const update = async (_, { id: dewormingId, changes }, context) => {
  const user = await validateGraphQLSession(context.req);

  return updateDeworming(user.id, dewormingId, changes);
};

const destroy = async (_, { id: dewormingId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return deleteDeworming(user.id, dewormingId);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
};
