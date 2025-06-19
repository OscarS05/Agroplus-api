const {
  getAll: getAllNotes,
  getById: getNoteById,
  create: createNote,
  update: updateNote,
  destroy: deleteNote,
} = require('./note.resolvers');

const query = {
  notes: getAllNotes,
  note: getNoteById,
};

const mutation = {
  createNote,
  updateNote,
  deleteNote,
};

module.exports = { query, mutation };
