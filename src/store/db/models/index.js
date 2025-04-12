const { User, UserSchema } = require('./user.model');
const { Animal, AnimalSchema } = require('./animals.model');
const { Deworming, DewormingSchema } = require('./deworming.model');
const { Vaccination, VaccinationSchema } = require('./vaccination.model');
const { Note, NoteSchema } = require('./notes.model');


function setupModels(sequelize){
  User.init(UserSchema, User.config(sequelize));
  Animal.init(AnimalSchema, Animal.config(sequelize));
  Deworming.init(DewormingSchema, Deworming.config(sequelize));
  Vaccination.init(VaccinationSchema, Vaccination.config(sequelize));
  Note.init(NoteSchema, Note.config(sequelize));


  User.associate(sequelize.models);
  Animal.associate(sequelize.models);
  Deworming.associate(sequelize.models);
  Vaccination.associate(sequelize.models);
  Note.associate(sequelize.models);
}

module.exports = setupModels;
