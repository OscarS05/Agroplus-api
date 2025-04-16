const { DataTypes, Model } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const ANIMAL_TABLE = 'animals';

const AnimalSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
  breed: {
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
    type: DataTypes.UUID,
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
    type: DataTypes.UUID,
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
    type: DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}

class Animal extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
    this.belongsTo(models.Animal, { as: 'mother', foreignKey: 'motherId' });
    this.belongsTo(models.Animal, { as: 'father', foreignKey: 'fatherId' });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: ANIMAL_TABLE,
      modelName: 'Animal',
      timestamps: false
    }
  }
}

module.exports = { AnimalSchema, ANIMAL_TABLE, Animal }
