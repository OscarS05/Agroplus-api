const notesService = require('./notes.service');

const getAllNotes = async (req, res, next) => {
  try {
    const { query } = req;
    const userId = req.user.sub;

    const notes = await notesService.getAllNotes(userId, query);

    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const noteData = req.body;
    const userId = req.user.sub;

    const note = await notesService.createNote(userId, noteData);

    const formattedNoteData = await notesService.getNote(userId, note.id);

    res.status(201).json({
      message: 'Note was successfully created',
      note: formattedNoteData,
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const noteData = req.body;
    const userId = req.user.sub;

    const note = await notesService.updateNote(userId, noteId, noteData);

    const formattedNoteData = await notesService.getNote(userId, note.id);

    res.status(200).json({
      message: 'Note was successfully updated',
      note: formattedNoteData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.sub;

    const affectedRows = await notesService.deleteNote(userId, noteId);

    res.status(200).json({
      message: 'Note was successfully deleted',
      affectedRows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  updateNote,
  getAllNotes,
  deleteNote,
};
