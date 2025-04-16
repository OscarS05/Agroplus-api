const Boom = require('@hapi/boom');

const notesService = require('./notes.service');

const getAllNotes = async (req, res, next) => {
  try {
    const { title } = req.query;
    const userId = req.user.sub;

    const filters = {
      userId,
      ...(title && { title }),
    }

    const note = await notesService.getAllNotes(filters);

    res.status(200).json({ note, sucess: true });
  } catch (error) {
    next(error);
  }
}

const createNote = async (req, res, next) => {
  try {
    const noteData = req.body;
    const userId = req.user.sub;

    const newNote = await notesService.createNote({ ...noteData, userId });
    if(!newNote?.id) throw Boom.badRequest('Create animal operation returns null');
    const formattedNoteData = await notesService.getNote(userId, newNote.id);

    res.status(201).json({ message: 'Note was successfully created', success: true, newNote: formattedNoteData });
  } catch (error) {
    next(error);
  }
}

const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const noteData = req.body;
    const userId = req.user.sub;

    const updatedNote = await notesService.updateNote(userId, noteId, noteData);
    if(!updatedNote?.id) throw Boom.badRequest('Update animal operation returns null');
    const formattedNoteData = await notesService.getNote(userId, updatedNote.id);

    res.status(200).json({ message: 'Note was successfully updated', success: true, updatedNote: formattedNoteData });
  } catch (error) {
    next(error);
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.sub;

    const deletedNote = await notesService.deleteNote(userId, noteId);
    if(deletedNote === 0) throw Boom.badRequest('Delete animal operation returns 0 rows affected');

    res.status(200).json({ message: 'Note was successfully deleted', success: true, deletedNote });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  createNote,
  updateNote,
  getAllNotes,
  deleteNote,
}
