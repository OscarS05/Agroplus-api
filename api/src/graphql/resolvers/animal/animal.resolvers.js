const {
  getAllAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} = require('../../../modules/animal/animal.service');
const {
  validateGraphQLSession,
} = require('../../../middlewares/authentication');

const getAll = async (_, { filters }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getAllAnimals({ ...filters, userId: user.id });
};

const getById = async (_, { id }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getAnimal(user.id, id);
};

const create = async (_, { input }, context) => {
  const user = await validateGraphQLSession(context.req);

  return createAnimal({ ...input, userId: user.id });
};

const update = async (_, { id: animalId, changes }, context) => {
  const user = await validateGraphQLSession(context.req);

  return updateAnimal(user.id, animalId, changes);
};

const destroy = async (_, { id: animalId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return deleteAnimal(user.id, animalId);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
};
