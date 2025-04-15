const express = require('express');

const { routes: userRouter, authRoutes } = require('./user/user.routes');
const animalRoutes = require('./animal/animal.routes');
const dewormingRoutes = require('./deworming/deworming.routes');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/auth', authRoutes);
  router.use('/animals', animalRoutes);
  router.use('/deworming', dewormingRoutes);
}

module.exports = { routerApi };
