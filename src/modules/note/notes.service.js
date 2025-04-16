// const Boom = require('@hapi/boom');

// const dewormingRepository = require('./notes.repository');
// const animalRepository = require('../animal/animal.repository');

// const getAllDeworming = async (userId, filters) => {
//   const deworming = await dewormingRepository.findAllDewormings(userId, filters);

//   return deworming.map(deworming => formatDeworming(deworming));
// }

// const formatDeworming = (vaccination) => {
//   return {
//     id: vaccination.id,
//     vaccine: vaccination.vaccine,
//     description: vaccination.description || null,
//     animalId: vaccination.animalId,
//     registeredAt: vaccination.registeredAt.toISOString().split('T')[0] || vaccination.registeredAt,
//   }
// }

// const getDeworming = async (userId, dewormingId) => {
//   const deworming = await dewormingRepository.findOne(userId, dewormingId);
//   if(!deworming?.id) throw Boom.notFound('Deworming does not exist');
//   return deworming;
// }

// const createDeworming = async (userId, dewormingData) => {
//   const animal = await animalRepository.findOne(userId, dewormingData.animalId);
//   if(!animal?.id) throw Boom.notFound('Animal does not exist or does not belong to the user');

//   const deworming = {
//     dewormer: dewormingData.dewormer,
//     description: dewormingData.description || null,
//     animalId: dewormingData.animalId,
//     registeredAt: dewormingData.registeredAt || new Date().toISOString().split('T')[0],
//   }

//   const newdeworming = await dewormingRepository.create(deworming);
//   if(!newdeworming?.id) throw Boom.badRequest('Something went wrong creating the deworming');
//   return formatDeworming(newdeworming);
// }

// const updateDeworming = async (userId, dewormingId, dewormingData) => {
//   const deworming = await dewormingRepository.findOne(userId, dewormingId);
//   if(!deworming?.id) throw Boom.conflict('deworming does not exists');

//   const formattedDewormingData = {
//     dewormer: dewormingData.dewormer,
//     ...(dewormingData.description && { description: dewormingData.description }),
//   }

//   const [ updatedRows, [ updatedDeworming ]] = await dewormingRepository.update(dewormingId, formattedDewormingData);
//   if(!updatedDeworming?.id) throw Boom.badRequest('Something went wrong creating the deworming');
//   return formatDeworming(updatedDeworming);
// }

// const deleteDeworming = async (userId, dewormingId) => {
//   const deworming = await dewormingRepository.findOne(userId, dewormingId);
//   if(!deworming?.id) throw Boom.conflict('deworming does not exists');

//   return await dewormingRepository.destroy(dewormingId);
// }

// module.exports = {
//   getAllDeworming,
//   getDeworming,
//   createDeworming,
//   updateDeworming,
//   deleteDeworming,
// }
