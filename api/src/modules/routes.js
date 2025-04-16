const express = require('express');

const { routes: userRouter, authRoutes } = require('./user/user.routes');
const animalRoutes = require('./animal/animal.routes');
const dewormingRoutes = require('./deworming/deworming.routes');
const vaccinationRoutes = require('./vaccination/vaccination.routes');
const noteRoutes = require('./note/notes.routes');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/auth', authRoutes);
  router.use('/animals', animalRoutes);
  router.use('/animals', dewormingRoutes);
  router.use('/animals', vaccinationRoutes);
  router.use('/notes', noteRoutes);
}

module.exports = { routerApi };
