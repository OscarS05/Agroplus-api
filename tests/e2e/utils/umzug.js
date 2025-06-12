const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../../../api/src/store/db/sequelize');

const umzug = new Umzug({
  migrations: { glob: './api/src/store/db/seeders/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});

const upSeed = async () => {
  try {
    await sequelize.sync({ force: true });
    await umzug.up();
  } catch (error) {
    console.error(error);
  }
};

const downSeed = async () => {
  await sequelize.drop();
};

module.exports = {
  upSeed,
  downSeed,
};
