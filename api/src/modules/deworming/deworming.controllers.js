const Boom = require('@hapi/boom');

const dewormingService = require('./deworming.service');

const getAllDeworming = async (req, res, next) => {
  try {
    const { query } = req;
    const userId = req.user.sub;

    const deworming = await dewormingService.getAllDeworming(userId, query);

    res.status(200).json({ deworming, sucess: true });
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
    if (!newDeworming?.id)
      throw Boom.badRequest('Create animal operation returns null');
    const formattedDewormingData = await dewormingService.getDeworming(
      userId,
      newDeworming.id,
    );

    res.status(201).json({
      message: 'Deworming was successfully created',
      success: true,
      newDeworming: formattedDewormingData,
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
    if (!updatedDeworming?.id)
      throw Boom.badRequest('Update animal operation returns null');
    const formattedDewormingData = await dewormingService.getDeworming(
      userId,
      updatedDeworming.id,
    );

    res.status(200).json({
      message: 'Deworming was successfully updated',
      success: true,
      updatedDeworming: formattedDewormingData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDeworming = async (req, res, next) => {
  try {
    const { dewormingId } = req.params;
    const userId = req.user.sub;

    const deletedDeworming = await dewormingService.deleteDeworming(
      userId,
      dewormingId,
    );
    if (deletedDeworming === 0)
      throw Boom.badRequest('Delete animal operation returns 0 rows affected');

    res.status(200).json({
      message: 'Deworming was successfully deleted',
      success: true,
      deletedDeworming,
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
