jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('sequelize', () => ({
  Op: {
    iLike: jest.fn(),
  },
}));

const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../../api/src/modules/note/notes.service');
const noteRepository = require('../../api/src/modules/note/notes.repository');

const { note1, note2, user1, user2 } = require('./utils/fake-data');

jest.mock('../../api/src/modules/note/notes.repository', () => ({
  findAllNotes: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Note service', () => {
  const { id: userId } = user1();
  const { id: noteId } = note1();

  describe('getAllNotes()', () => {
    const dbResponse = [
      note1({ user: { id: user1().id, name: user1().name } }),
      note2({ id: user1().id, name: user1().name }),
      note2({ user: { id: user2().id, name: user2().name } }),
    ];
    let query = null;
    Op.iLike.mockResolvedValue('Operation');

    beforeEach(() => {
      query = {
        userId,
      };
    });

    test('It should return filtered notes by userId', async () => {
      noteRepository.findAllNotes.mockResolvedValue([
        dbResponse[0],
        dbResponse[1],
      ]);

      const result = await getAllNotes(query);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(
        expect.objectContaining({
          id: dbResponse[0].id,
          title: dbResponse[0].title,
          user: user1().name,
          userId: user1().id,
        }),
      );

      expect(noteRepository.findAllNotes).toHaveBeenCalledTimes(1);
      expect(noteRepository.findAllNotes).toHaveBeenCalledWith(
        expect.objectContaining({ userId }),
      );
    });

    test('It should return filtered notes by title', async () => {
      query.title = 'note 2';
      noteRepository.findAllNotes.mockResolvedValue([dbResponse[1]]);

      const result = await getAllNotes(query);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(
        expect.objectContaining({
          id: dbResponse[1].id,
          title: dbResponse[1].title,
        }),
      );

      expect(noteRepository.findAllNotes).toHaveBeenCalledTimes(1);
      expect(noteRepository.findAllNotes).toHaveBeenCalledWith(
        expect.objectContaining({ userId, title: expect.any(Object) }),
      );
    });

    test('It should return an empty array if no notes are found', async () => {
      noteRepository.findAllNotes.mockResolvedValue([]);

      const result = await getAllNotes(query);

      expect(result).toEqual([]);
      expect(noteRepository.findAllNotes).toHaveBeenCalledTimes(1);
    });

    test('It should throw Boom error if query is not provided', async () => {
      await expect(getAllNotes(null)).rejects.toThrow('was not provided');

      expect(noteRepository.findAllNotes).not.toHaveBeenCalled();
    });

    test('It should throw Boom error if userId is not provided', async () => {
      delete query.userId;

      await expect(getAllNotes(query)).rejects.toThrow('was not provided');

      expect(noteRepository.findAllNotes).not.toHaveBeenCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getNote()', () => {
    const dbResponse = note1();

    test('It should return a specific note', async () => {
      noteRepository.findOne.mockResolvedValue(dbResponse);

      const result = await getNote(userId, noteId);

      expect(result).toEqual(
        expect.objectContaining({
          id: dbResponse.id,
          title: dbResponse.title,
        }),
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.findOne).toHaveBeenCalledWith(userId, noteId);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(getNote(null, noteId)).rejects.toThrow(/was not provided/);
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because noteId was not provided', async () => {
      await expect(getNote(userId, null)).rejects.toThrow(/was not provided/);
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      noteRepository.findOne.mockResolvedValue(null);

      await expect(getNote(userId, noteId)).rejects.toThrow(/not exist/);
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('createNote()', () => {
    const dbResponse = note1();
    const fakeUuid = 'fake-uuid-123';
    uuidv4.mockReturnValue(fakeUuid);

    let noteData = null;

    beforeEach(() => {
      noteData = {
        userId,
        title: 'new title',
      };
    });

    test('It should return a new note', async () => {
      noteRepository.create.mockResolvedValue({
        ...dbResponse,
        id: fakeUuid,
        title: noteData.title,
        description: null,
      });

      const result = await createNote(noteData);

      expect(result.id).toBe(fakeUuid);
      expect(result.title).toBe(noteData.title);
      expect(result.description).toBe(null);
      expect(noteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: fakeUuid,
          title: noteData.title,
          description: null,
        }),
      );
    });

    test('It should return an error because userId was not provided', async () => {
      delete noteData.userId;

      await expect(createNote(noteData)).rejects.toThrow(/not provided/);
      expect(noteRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because title was not provided', async () => {
      delete noteData.title;

      await expect(createNote(noteData)).rejects.toThrow(/not provided/);
      expect(noteRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      noteRepository.create.mockResolvedValue(null);

      await expect(createNote(noteData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(noteRepository.create).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('updateNote()', () => {
    let noteData = null;
    let dbResponse = null;

    beforeEach(() => {
      noteData = { title: 'title x', description: 'description x' };

      dbResponse = {
        ...note1(),
        title: noteData.title,
        description: noteData.description,
      };
    });

    test('It should return an updated note', async () => {
      noteRepository.findOne.mockResolvedValue(note1());
      noteRepository.update.mockResolvedValue([1, [dbResponse]]);

      const result = await updateNote(userId, noteId, noteData);

      expect(result.id).toBe(noteId);
      expect(result.title).toBe(noteData.title);
      expect(result.description).toBe(noteData.description);
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the note to be updated does not exist', async () => {
      noteRepository.findOne.mockResolvedValue(null);

      await expect(updateNote(userId, noteId, noteData)).rejects.toThrow(
        /does not exist/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      noteRepository.findOne.mockResolvedValue(note1());
      noteRepository.update.mockResolvedValue([0, [null]]);

      await expect(updateNote(userId, noteId, noteData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because There is no data to update', async () => {
      noteRepository.findOne.mockResolvedValue(note1());
      delete noteData.title;
      delete noteData.description;

      await expect(updateNote(userId, noteId, noteData)).rejects.toThrow(
        /was not provided/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
      expect(noteRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(updateNote(null, noteId, noteData)).rejects.toThrow(
        /was not provided/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
      expect(noteRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because noteId was not provided', async () => {
      await expect(updateNote(userId, null, noteData)).rejects.toThrow(
        /was not provided/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
      expect(noteRepository.update).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('deleteNote()', () => {
    test('It should return a deleted note', async () => {
      noteRepository.findOne.mockResolvedValue(note1());
      noteRepository.destroy.mockResolvedValue(1);

      const result = await deleteNote(userId, noteId);

      expect(result).toBe(1);
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.destroy).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(deleteNote(null, noteId)).rejects.toThrow(
        /was not provided/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
      expect(noteRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because noteId was not provided', async () => {
      await expect(deleteNote(userId, null)).rejects.toThrow(
        /was not provided/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(0);
      expect(noteRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the note does not exist', async () => {
      noteRepository.findOne.mockResolvedValue(null);

      await expect(deleteNote(userId, noteId)).rejects.toThrow(
        /does not exist/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      noteRepository.findOne.mockResolvedValue(note1());
      noteRepository.destroy.mockResolvedValue(0);

      await expect(deleteNote(userId, noteId)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(noteRepository.findOne).toHaveBeenCalledTimes(1);
      expect(noteRepository.destroy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
