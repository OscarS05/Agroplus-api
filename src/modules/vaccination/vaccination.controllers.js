const Boom = require('@hapi/boom');

const vaccinationService = require('./vaccination.service');

const getAllVaccination = async (req, res, next) => {
  try {
    const { vaccine, animalId } = req.query;
    const userId = req.user.sub;

    const filters = {
      ...(vaccine && { vaccine }),
      ...(animalId && { animalId }),
    }

    const vaccinations = await vaccinationService.getAllVaccination(userId, filters);

    res.status(200).json({ vaccinations, sucess: true });
  } catch (error) {
    next(error);
  }
}

const createVaccination = async (req, res, next) => {
  try {
    const { animalId } = req.params;
    const vaccinationData = req.body;
    const userId = req.user.sub;

    const newVaccination = await vaccinationService.createVaccination(userId, { ...vaccinationData, animalId });
    if(!newVaccination?.id) throw Boom.badRequest('Create animal operation returns null');
    const formattedVaccinationData = await vaccinationService.getVaccination(userId, newVaccination.id);

    res.status(201).json({ message: 'Vaccination was successfully created', success: true, newVaccination: formattedVaccinationData });
  } catch (error) {
    next(error);
  }
}

const updateVaccination = async (req, res, next) => {
  try {
    const { vaccinationId } = req.params;
    const vaccinationData = req.body;
    const userId = req.user.sub;

    const updatedVaccination = await vaccinationService.updateVaccination(userId, vaccinationId, vaccinationData);
    if(!updatedVaccination?.id) throw Boom.badRequest('Update animal operation returns null');
    const formattedVaccinationData = await vaccinationService.getVaccination(userId, updatedVaccination.id);

    res.status(200).json({ message: 'Vaccination was successfully updated', success: true, updatedVaccination: formattedVaccinationData });
  } catch (error) {
    next(error);
  }
}

const deleteVaccination = async (req, res, next) => {
  try {
    const { vaccinationId } = req.params;
    const userId = req.user.sub;

    const deletedVaccination = await vaccinationService.deleteVaccination(userId, vaccinationId);
    if(deletedVaccination === 0) throw Boom.badRequest('Delete animal operation returns 0 rows affected');

    res.status(200).json({ message: 'Vaccination was successfully deleted', success: true, deletedVaccination });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  createVaccination,
  updateVaccination,
  getAllVaccination,
  deleteVaccination,
}
