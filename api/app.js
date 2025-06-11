const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const swaggerUI = require('swagger-ui-express');
const specs = require('./src/utils/docs/swagger');

const {
  logErrors,
  ormErrorHandler,
  boomErrorHandler,
  errorHandler,
} = require('./src/middlewares/error.handler');
const { routerApi } = require('./src/modules/routes');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
  routerApi(app);

  app.use(logErrors);
  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
