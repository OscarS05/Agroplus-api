const Boom = require('@hapi/boom');

const animalService = require('./animal.service');

const getAllAnimals = async (req, res, next) => {
  try {
    const { query } = req;
    const userId = req.user.sub;

    const animals = await animalService.getAllAnimals({ ...query, userId });

    res.status(200).json({ animals });
  } catch (error) {
    next(error);
  }
};

const createAnimal = async (req, res, next) => {
  try {
    const animalData = req.body;
    const userId = req.user.sub;

    const newAnimal = await animalService.createAnimal({
      ...animalData,
      userId,
    });

    res.status(201).json({
      message: 'Animal was successfully created',
      animal: newAnimal,
    });
  } catch (error) {
    next(error);
  }
};

const updateAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const animalData = req.body;
    const userId = req.user.sub;

    const updatedAnimal = await animalService.updateAnimal(
      userId,
      animalId,
      animalData,
    );

    res.status(200).json({
      message: 'Animal was successfully updated',
      animal: updatedAnimal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const userId = req.user.sub;

    const affectedRows = await animalService.deleteAnimal(userId, animalId);
    if (affectedRows === 0)
      throw Boom.badRequest('Delete animal operation returns 0 rows affected');

    res.status(200).json({
      message: 'Animal was successfully deleted',
      affectedRows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnimal,
  updateAnimal,
  getAllAnimals,
  deleteAnimal,
};
