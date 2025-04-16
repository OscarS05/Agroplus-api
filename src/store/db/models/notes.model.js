const { DataTypes, Model } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const NOTES_TABLE = 'notes';

const NoteSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
    type: DataTypes.UUID,
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

class Note extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: NOTES_TABLE,
      modelName: 'Note',
      timestamps: false
    }
  }
}

module.exports = { NoteSchema, NOTES_TABLE, Note }
