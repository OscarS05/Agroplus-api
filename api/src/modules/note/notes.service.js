const Boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const noteRepository = require('./notes.repository');

const formatNotes = (note) => {
  return {
    id: note.id,
    title: note.title,
    description: note.description || null,
    user: note.user ? { id: note.user.id, name: note.user.name } : null,
    createdAt: note.createdAt.toISOString().split('T')[0] || note.createdAt,
  };
};

const buildFilters = (query) => {
  const { title, limit = 10, offset = 0 } = query;

  const where = {
    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
  };

  return {
    where,
    limit: limit ?? parseInt(limit, 10),
    offset: offset ?? parseInt(offset, 10),
  };
};

const getAllNotes = async (userId, query) => {
  if (!query || typeof query !== 'object') {
    throw Boom.badRequest('query was not provided');
  }
  if (!userId) throw Boom.badData('userId was not provided');

  const filters = buildFilters(query);

  const notes = await noteRepository.findAllNotes(userId, filters);
  if (!notes?.length === 0) return [];

  return notes.map((note) => formatNotes(note));
};

const getNote = async (userId, noteId) => {
  if (!userId) throw Boom.notFound('userId was not provided');
  if (!noteId) throw Boom.notFound('noteId was not provided');

  const note = await noteRepository.findOne(userId, noteId);
  if (!note?.id) throw Boom.notFound('Note does not exist');

  return formatNotes(note);
};

const createNote = async (userId, noteData) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!noteData?.title && !noteData?.description) {
    throw Boom.badRequest('noteData was not provided');
  }

  const note = {
    id: uuidv4(),
    title: noteData.title,
    description: noteData?.description || null,
    userId,
    createdAt: noteData.createdAt || new Date().toISOString().split('T')[0],
  };

  const newnote = await noteRepository.create(note);
  if (!newnote?.id) {
    throw Boom.badRequest('Something went wrong creating the note');
  }

  return getNote(note.userId, newnote.id);
};

const updateNote = async (userId, noteId, noteData) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!noteId) throw Boom.badRequest('noteId was not provided');
  if (!noteData?.title && !noteData?.description) {
    throw Boom.badRequest('noteData was not provided');
  }

  const note = await getNote(userId, noteId);
  if (!note?.id) throw Boom.notFound('Note does not exist');

  const formattedNoteData = {
    title: noteData.title,
    ...(noteData.description && { description: noteData.description }),
  };

  const [updatedRows, [updatedNote]] = await noteRepository.update(
    noteId,
    formattedNoteData,
  );

  if (updatedRows === 0) {
    throw Boom.badRequest('Something went wrong creating the note');
  }

  return getNote(updatedNote.userId, updatedNote.id);
};

const deleteNote = async (userId, noteId) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!noteId) throw Boom.badRequest('noteId was not provided');

  const note = await getNote(userId, noteId);
  if (!note?.id) throw Boom.conflict('note does not exists');

  const affectedRows = await noteRepository.destroy(noteId);

  if (affectedRows === 0) {
    throw Boom.badRequest('Something went wrong deleting the note');
  }

  return affectedRows;
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
