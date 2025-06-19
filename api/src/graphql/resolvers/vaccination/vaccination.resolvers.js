const {
  getAllVaccination,
  getVaccination,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} = require('../../../modules/vaccination/vaccination.service');
const {
  validateGraphQLSession,
} = require('../../../middlewares/authentication');

const getAll = async (_, { query = {} }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getAllVaccination(user.id, query);
};

const getById = async (_, { id: vaccinationId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getVaccination(user.id, vaccinationId);
};

const create = async (_, { input }, context) => {
  const user = await validateGraphQLSession(context.req);

  return createVaccination(user.id, input);
};

const update = async (_, { id: vaccinationId, changes }, context) => {
  const user = await validateGraphQLSession(context.req);

  return updateVaccination(user.id, vaccinationId, changes);
};

const destroy = async (_, { id: vaccinationId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return deleteVaccination(user.id, vaccinationId);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
};
