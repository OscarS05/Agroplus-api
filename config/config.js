require('dotenv').config();
 
const config = {
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUrl: process.env.DB_URL,
    urlFront: process.env.URL_FRONT,
}
 
 module.exports = { config };