const Boom = require('@hapi/boom');

const vaccinationService = require('./vaccination.service');

const getAllVaccination = async (req, res, next) => {
  try {
    const { query } = req;
    const userId = req.user.sub;

    const vaccinations = await vaccinationService.getAllVaccination(
      userId,
      query,
    );

    res.status(200).json({ vaccinations });
  } catch (error) {
    next(error);
  }
};

const createVaccination = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const vaccinationData = req.body;
    const userId = req.user.sub;

    const newVaccination = await vaccinationService.createVaccination(userId, {
      ...vaccinationData,
      animalId,
    });
    if (!newVaccination?.id)
      throw Boom.badRequest('Create animal operation returns null');
    const formattedVaccinationData = await vaccinationService.getVaccination(
      userId,
      newVaccination.id,
    );

    res.status(201).json({
      message: 'Vaccination was successfully created',
      success: true,
      vaccination: formattedVaccinationData,
    });
  } catch (error) {
    next(error);
  }
};

const updateVaccination = async (req, res, next) => {
  try {
    const { vaccinationId } = req.params;
    const vaccinationData = req.body;
    const userId = req.user.sub;

    const updatedVaccination = await vaccinationService.updateVaccination(
      userId,
      vaccinationId,
      vaccinationData,
    );

    const formattedVaccinationData = await vaccinationService.getVaccination(
      userId,
      updatedVaccination.id,
    );

    res.status(200).json({
      message: 'Vaccination was successfully updated',
      success: true,
      vaccination: formattedVaccinationData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVaccination = async (req, res, next) => {
  try {
    const { vaccinationId } = req.params;
    const userId = req.user.sub;

    const affectedRows = await vaccinationService.deleteVaccination(
      userId,
      vaccinationId,
    );

    res.status(200).json({
      message: 'Vaccination was successfully deleted',
      success: true,
      affectedRows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVaccination,
  updateVaccination,
  getAllVaccination,
  deleteVaccination,
};
