const Boom = require('@hapi/boom');

const animalService = require('./animal.service');

const getAllAnimals = async (req, res, next) => {
  try {
    const { livestockType, animalType, breed } = req.query;
    const userId = req.user.sub;

    const filters = {
      userId,
      ...(livestockType && { livestockType }),
      ...(animalType && { animalType }),
      ...(breed && { breed }),
    }

    const animals = await animalService.getAllAnimals(filters);

    res.status(200).json({ animals, sucess: true });
  } catch (error) {
    next(error);
  }
}

const getOneAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const userId = req.user.sub;

    const animal = await animalService.getAnimal(userId, animalId);

    res.status(200).json({ animal, sucess: true });
  } catch (error) {
    next(error);
  }
}

const createAnimal = async (req, res, next) => {
  try {
    const animalData = req.body;
    const userId = req.user.sub;

    const newAnimal = await animalService.createAnimal({ ...animalData, userId });
    if(!newAnimal?.id) throw Boom.badRequest('Create animal operation returns null');
    const formattedUpdatedAnimal = await animalService.getAnimal(userId, newAnimal.id);

    res.status(201).json({ message: 'Animal was successfully created', success: true, newAnimal: formattedUpdatedAnimal });
  } catch (error) {
    next(error);
  }
}

const updateAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const animalData = req.body;
    const userId = req.user.sub;

    const updatedAnimal = await animalService.updateAnimal(userId, animalId, animalData);
    if(!updatedAnimal?.id) throw Boom.badRequest('Update animal operation returns null');
    const formattedUpdatedAnimal = await animalService.getAnimal(userId, updatedAnimal.id);

    res.status(200).json({ message: 'Animal was successfully updated', success: true, updatedAnimal: formattedUpdatedAnimal });
  } catch (error) {
    next(error);
  }
}

const deleteAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const userId = req.user.sub;

    const deletedAnimal = await animalService.deleteAnimal(userId, animalId);
    if(deletedAnimal === 0) throw Boom.badRequest('Delete animal operation returns 0 rows affected');

    res.status(200).json({ message: 'Animal was successfully deleted', success: true, deletedAnimal });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getOneAnimal,
  createAnimal,
  updateAnimal,
  getAllAnimals,
  deleteAnimal,
}
