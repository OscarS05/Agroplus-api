const {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../../../modules/note/notes.service');
const {
  validateGraphQLSession,
} = require('../../../middlewares/authentication');

const getAll = async (_, { query = {} }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getAllNotes(user.id, query);
};

const getById = async (_, { id: noteId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return getNote(user.id, noteId);
};

const create = async (_, { input }, context) => {
  const user = await validateGraphQLSession(context.req);

  return createNote(user.id, input);
};

const update = async (_, { id: noteId, changes }, context) => {
  const user = await validateGraphQLSession(context.req);

  return updateNote(user.id, noteId, changes);
};

const destroy = async (_, { id: noteId }, context) => {
  const user = await validateGraphQLSession(context.req);

  return deleteNote(user.id, noteId);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
};
