const {
  getAll: getAllVaccinations,
  getById: getVaccinationById,
  create: createVaccination,
  update: updateVaccination,
  destroy: deleteVaccination,
} = require('./vaccination.resolvers');

const query = {
  vaccinations: getAllVaccinations,
  vaccination: getVaccinationById,
};

const mutation = {
  createVaccination,
  updateVaccination,
  deleteVaccination,
};

module.exports = { query, mutation };
