const env = process.env.NODE_ENV || 'development';

const envs = {
  development: '.env',
  e2e: '.env.e2e',
};

const options = {};

if (envs[env]) {
  options.path = envs[env];
}

require('dotenv').config(options);

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
  urlFront: process.env.URL_FRONT,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
};

module.exports = { config };
