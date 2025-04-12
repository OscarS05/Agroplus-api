const { DataTypes } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const ANIMAL_TABLE = 'animals';

const AnimalSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  livestockType: {
    field: 'livestock_type',
    allowNull: false,
    type: DataTypes.STRING,
  },
  animalType: {
    field: 'animal_type',
    allowNull: false,
    type: DataTypes.STRING,
  },
  code: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  sex: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  registeredAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'registered_at',
    defaultValue: DataTypes.NOW
  },
  birthDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'birth_date',
    defaultValue: DataTypes.NOW
  },
  motherId: {
    field: 'mother_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: ANIMAL_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  fatherId: {
    field: 'father_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: ANIMAL_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  userId: {
    field: 'user_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}

class Animal {
  static associate(models) {

  }

  static config(sequelize){
    return {
      sequelize,
      tableName: ANIMAL_TABLE,
      modelName: 'Animal',
      timestamp: false
    }
  }
}

module.exports = { AnimalSchema, ANIMAL_TABLE, Animal }
