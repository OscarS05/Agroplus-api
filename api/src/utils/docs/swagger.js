const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const { config } = require('../../../config/config');

const routes = [
  path.resolve(__dirname, '../../modules/user/user.routes.js'),
  path.resolve(__dirname, '../../modules/animal/animal.routes.js'),
  path.resolve(__dirname, '../../modules/deworming/deworming.routes.js'),
  path.resolve(__dirname, '../../modules/vaccination/vaccination.routes.js'),
  path.resolve(__dirname, '../../modules/note/notes.routes.js'),
];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agroplus-API',
      version: '1.0.0',
      description:
        'Agroplus-API is designed to help cattle ranchers manage all necessary information about their livestock. It allows users to maintain a history of all animals they currently own or have owned, along with detailed information about each animal. Registered animals can be offspring of other animals, with the option to specify their parentage. Additionally, the API provides features to track vaccination and deworming histories for each animal. Ranchers can also use a note-taking system to record completed tasks, pending tasks, or any other notes they need. This project is built using **Node.js with Express.js, Sequelize ORM, JWT authentication, and Docker for development containers**, following an **MVC architecture based on entities**.',
      contact: {
        name: 'Santiago Monsalve',
        email: 'santiagom0509@hotmail.com',
      },
      license: {
        name: 'CC BY-NC 4.0',
        url: 'https://creativecommons.org/licenses/by-nc/4.0/',
      },
    },
    servers: [
      {
        url: `https://agroplus-api.onrender.com/api/v1`,
        description: 'Remote server',
      },
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Local server',
      },
    ],
    tags: [
      {
        name: 'user',
        description: 'Everything about the user',
      },
      {
        name: 'auth',
        description: 'Everything about the user',
      },
      {
        name: 'animal',
        description: 'Everything about the animal',
      },
      {
        name: 'deworming',
        description: 'Everything about the deworming',
      },
      {
        name: 'vaccination',
        description: 'Everything about the vaccination',
      },
      {
        name: 'notes',
        description: 'Everything about the notes',
      },
    ],
    externalDocs: {
      description: 'Find out the GitHub repository',
      url: 'https://github.com/OscarS05/Agroplus-api',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
  apis: [...routes, path.resolve(__dirname, './swaggerSchemas/*.js')],
};
// console.log('options:', options)

const specs = swaggerJsDoc(options);
// console.log('specs:', specs)
module.exports = specs;
