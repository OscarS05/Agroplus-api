const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');

const noteRepository = require('./notes.repository');

const getAllNotes = async (filters) => {
  const notes = await noteRepository.findAllNotes(filters);
  if(!notes?.length === 0) return [];
  return notes.map(note => formatNotes(note));
}

const formatNotes = (note) => {
  return {
    id: note.id,
    vaccine: note.title,
    description: note.description || null,
    userId: note.user ? note.user.name : null,
    createdAt: note.createdAt.toISOString().split('T')[0] || note.createdAt,
  }
}

const getNote = async (userId, noteId) => {
  const note = await noteRepository.findOne(userId, noteId);
  if(!note?.id) throw Boom.notFound('Note does not exist');
  return formatNotes(note);
}

const createNote = async (noteData) => {
  const note = {
    id: uuidv4(),
    title: noteData.title,
    description: noteData.description || null,
    userId: noteData.userId,
    createdAt: noteData.createdAt || new Date().toISOString().split('T')[0],
  }

  const newnote = await noteRepository.create(note);
  if(!newnote?.id) throw Boom.badRequest('Something went wrong creating the note');
  return newnote;
}

const updateNote = async (userId, noteId, noteData) => {
  const note = await getNote(userId, noteId);
  if(!note?.id) throw Boom.notFound('Note does not exist');

  const formattedNoteData = {
    title: noteData.title,
    ...(noteData.description && { description: noteData.description }),
  }

  const [ updatedRows, [ updatedNote ]] = await noteRepository.update(noteId, formattedNoteData);
  if(!updatedNote?.id) throw Boom.badRequest('Something went wrong creating the note');
  return updatedNote;
}

const deleteNote = async (userId, noteId) => {
  const note = await getNote(userId, noteId);
  if(!note?.id) throw Boom.conflict('note does not exists');

  return await noteRepository.destroy(noteId);
}

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
}
