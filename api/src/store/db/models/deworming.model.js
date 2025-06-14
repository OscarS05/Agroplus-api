const { DataTypes, Model } = require('sequelize');
const { ANIMAL_TABLE } = require('./animals.model');

const DEWORMING_TABLE = 'deworming';

const DewormingSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  dewormer: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  animalId: {
    field: 'animal_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: ANIMAL_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  registeredAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'registered_at',
    defaultValue: DataTypes.NOW,
  },
};

class Deworming extends Model {
  static associate(models) {
    this.belongsTo(models.Animal, { foreignKey: 'animalId', as: 'animal' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DEWORMING_TABLE,
      modelName: 'Deworming',
      timestamps: false,
    };
  }
}

module.exports = { DewormingSchema, DEWORMING_TABLE, Deworming };
