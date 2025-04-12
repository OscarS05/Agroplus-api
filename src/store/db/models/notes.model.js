const { DataTypes } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const NOTES_TABLE = 'notes';

const NoteSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  title: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
}

class Note {
  static associate(models) {

  }

  static config(sequelize){
    return {
      sequelize,
      tableName: NOTES_TABLE,
      modelName: 'Note',
      timestamp: false
    }
  }
}

module.exports = { NoteSchema, NOTES_TABLE, Note }
