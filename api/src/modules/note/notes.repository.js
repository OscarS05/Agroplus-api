const sequelize = require('../../store/db/sequelize');

const findAllNotes = async (userId, { where, limit, offset }) => {
  return sequelize.models.Note.findAll({
    where: { ...where, userId },
    limit,
    offset,
    include: [
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });
};

const findOne = async (userId, noteId) => {
  return sequelize.models.Note.findOne({
    where: { userId, id: noteId },
    include: [
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });
};

const create = async (noteData) => {
  return sequelize.models.Note.create(noteData);
};

const update = async (noteId, noteData) => {
  return sequelize.models.Note.update(noteData, {
    where: { id: noteId },
    returning: true,
  });
};

const destroy = async (noteId) => {
  return sequelize.models.Note.destroy({ where: { id: noteId } });
};

module.exports = {
  findAllNotes,
  findOne,
  create,
  update,
  destroy,
};
