/* eslint-disable no-nested-ternary */
const { Sequelize } = require('sequelize');

const { config } = require('../../../config/config');
const setupModels = require('./models/index');

const options = {
  dialect: 'postgres',
  logging: config.isProd
    ? false
    : config.env === 'e2e'
      ? false
      : (msg) => console.info(msg),
};

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(config.dbUrl, options);

(async () => {
  try {
    await sequelize.authenticate();
    console.info('Database connected!');
  } catch (error) {
    console.info(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
})();

setupModels(sequelize);

module.exports = sequelize;
