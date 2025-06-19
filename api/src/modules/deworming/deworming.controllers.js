const dewormingService = require('./deworming.service');

const getAllDeworming = async (req, res, next) => {
  try {
    const { query } = req;
    const userId = req.user.sub;

    const deworming = await dewormingService.getAllDeworming(userId, query);

    res.status(200).json({ deworming });
  } catch (error) {
    next(error);
  }
};

const createDeworming = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const dewormingData = req.body;
    const userId = req.user.sub;

    const newDeworming = await dewormingService.createDeworming(userId, {
      ...dewormingData,
      animalId,
    });

    res.status(201).json({
      message: 'Deworming was successfully created',
      deworming: newDeworming,
    });
  } catch (error) {
    next(error);
  }
};

const updateDeworming = async (req, res, next) => {
  try {
    const { dewormingId } = req.params;
    const dewormingData = req.body;
    const userId = req.user.sub;

    const updatedDeworming = await dewormingService.updateDeworming(
      userId,
      dewormingId,
      dewormingData,
    );

    res.status(200).json({
      message: 'Deworming was successfully updated',
      deworming: updatedDeworming,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDeworming = async (req, res, next) => {
  try {
    const { dewormingId } = req.params;
    const userId = req.user.sub;

    const affectedRows = await dewormingService.deleteDeworming(
      userId,
      dewormingId,
    );

    res.status(200).json({
      message: 'Deworming was successfully deleted',
      affectedRows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDeworming,
  updateDeworming,
  getAllDeworming,
  deleteDeworming,
};
