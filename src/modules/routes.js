const express = require('express');

const { routes: userRouter, authRoutes } = require('./user/user.routes');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/auth', authRoutes);
}

module.exports = { routerApi };
