const Boom = require('@hapi/boom');

const vaccinationRepository = require('./vaccination.repository');
const animalRepository = require('../animal/animal.repository');

const getAllVaccination = async (userId, filters) => {
  const vaccinations = await vaccinationRepository.findAllVaccinations(userId, filters);
  if(vaccinations.length === 0) throw Boom.notFound('No vaccinations found');

  return vaccinations.map(vaccination => formatVaccination(vaccination));
}

const formatVaccination = (vaccination) => {
  return {
    id: vaccination.id,
    vaccine: vaccination.vaccine,
    description: vaccination.description || null,
    animalId: vaccination.animalId,
    registeredAt: vaccination.registeredAt.toISOString().split('T')[0] || vaccination.registeredAt,
  }
}

const getVaccination = async (userId, vaccinationId) => {
  const vaccination = await vaccinationRepository.findOne(userId, vaccinationId);
  if(!vaccination?.id) throw Boom.notFound('Vaccination does not exist');
  return vaccination;
}

const createVaccination = async (userId, vaccinationData) => {
  const animal = await animalRepository.findOne(userId, vaccinationData.animalId);
  if(!animal?.id) throw Boom.notFound('Animal does not exist or does not belong to the user');

  const vaccination = {
    vaccine: vaccinationData.vaccine,
    description: vaccinationData.description || null,
    animalId: vaccinationData.animalId,
    registeredAt: vaccinationData.registeredAt || new Date().toISOString().split('T')[0],
  }

  const newVaccination = await vaccinationRepository.create(vaccination);
  if(!newVaccination?.id) throw Boom.badRequest('Something went wrong creating the vaccination');
  return formatVaccination(newVaccination);
}

const updateVaccination = async (userId, vaccinationId, vaccinationData) => {
  const vaccination = await getVaccination(userId, vaccinationId);
  if(!vaccination?.id) throw Boom.conflict('vaccination does not exists');

  const formattedVaccinationData = {
    vaccine: vaccinationData.vaccine,
    ...(vaccinationData.description && { description: vaccinationData.description }),
  }

  const [ updatedRows, [ updatedVaccination ]] = await vaccinationRepository.update(vaccinationId, formattedVaccinationData);
  if(!updatedVaccination?.id) throw Boom.badRequest('Something went wrong creating the vaccination');
  return formatVaccination(updatedVaccination);
}

const deleteVaccination = async (userId, vaccinationId) => {
  const vaccination = await getVaccination(userId, vaccinationId);
  if(!vaccination?.id) throw Boom.conflict('vaccination does not exists');

  return await vaccinationRepository.destroy(vaccinationId);
}

module.exports = {
  getAllVaccination,
  getVaccination,
  createVaccination,
  updateVaccination,
  deleteVaccination,
}
