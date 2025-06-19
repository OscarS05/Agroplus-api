const Boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const dewormingRepository = require('./deworming.repository');
const animalRepository = require('../animal/animal.repository');

const formatDeworming = (dewormer) => {
  return {
    id: dewormer.id,
    dewormer: dewormer.dewormer,
    description: dewormer.description || null,
    animal: dewormer.animal
      ? { code: dewormer.animal.code, id: dewormer.animal.id }
      : null,
    registeredAt:
      dewormer.registeredAt.toISOString().split('T')[0] ||
      dewormer.registeredAt,
  };
};

const buildFilters = (query) => {
  const { dewormer, animalId, limit = 10, offset = 0 } = query;

  const where = {
    ...(dewormer && { dewormer: { [Op.iLike]: `%${dewormer}%` } }),
    ...(animalId && { animalId }),
  };

  return {
    where,
    limit: limit ?? parseInt(limit, 10),
    offset: offset ?? parseInt(offset, 10),
  };
};

const getAllDeworming = async (userId, query) => {
  if (!query || typeof query !== 'object') {
    throw Boom.badRequest('query was not provided');
  }

  const filters = buildFilters(query);

  const deworming = await dewormingRepository.findAllDewormings(
    userId,
    filters,
  );

  if (deworming?.length === 0) return [];

  return deworming.map((d) => formatDeworming(d));
};

const getDeworming = async (userId, dewormingId) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!dewormingId) throw Boom.badRequest('dewormingId was not provided');

  const deworming = await dewormingRepository.findOne(userId, dewormingId);
  if (!deworming?.id) throw Boom.notFound('Deworming does not exist');

  return formatDeworming(deworming);
};

const createDeworming = async (userId, dewormingData) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!dewormingData?.dewormer || !dewormingData?.animalId) {
    throw Boom.badRequest('dewormer was not provided');
  }

  const animal = await animalRepository.findOne(userId, dewormingData.animalId);
  if (!animal?.id) {
    throw Boom.notFound('Animal does not exist or does not belong to the user');
  }

  const deworming = {
    id: uuidv4(),
    dewormer: dewormingData.dewormer,
    description: dewormingData?.description || null,
    animalId: dewormingData.animalId,
    registeredAt:
      dewormingData.registeredAt || new Date().toISOString().split('T')[0],
  };

  const newdeworming = await dewormingRepository.create(deworming);
  if (!newdeworming?.id) {
    throw Boom.badRequest('Something went wrong creating the deworming');
  }

  return getDeworming(userId, newdeworming.id);
};

const updateDeworming = async (userId, dewormingId, dewormingData) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!dewormingId) throw Boom.badRequest('dewormingId was not provided');
  if (!dewormingData?.dewormer && !dewormingData.description) {
    throw Boom.badRequest('dewormingData was not provided');
  }

  const deworming = await dewormingRepository.findOne(userId, dewormingId);
  if (!deworming?.id)
    throw Boom.conflict(
      'deworming does not exists or does not belong to the user',
    );

  const formattedDewormingData = {
    dewormer: dewormingData.dewormer,
    ...(dewormingData.description && {
      description: dewormingData.description,
    }),
  };

  const [updatedRows, [updatedDeworming]] = await dewormingRepository.update(
    dewormingId,
    formattedDewormingData,
  );
  if (updatedRows === 0) {
    throw Boom.badRequest('Something went wrong creating the deworming');
  }
  return getDeworming(userId, updatedDeworming.id);
};

const deleteDeworming = async (userId, dewormingId) => {
  if (!userId) throw Boom.badRequest('userId was not provided');
  if (!dewormingId) throw Boom.badRequest('dewormingId was not provided');

  const deworming = await dewormingRepository.findOne(userId, dewormingId);
  if (!deworming?.id) throw Boom.conflict('deworming does not exists');

  const affectedRows = await dewormingRepository.destroy(dewormingId);

  if (affectedRows === 0) {
    throw Boom.badRequest('Something went wrong deleting the deworming');
  }

  return affectedRows;
};

module.exports = {
  getAllDeworming,
  getDeworming,
  createDeworming,
  updateDeworming,
  deleteDeworming,
};
