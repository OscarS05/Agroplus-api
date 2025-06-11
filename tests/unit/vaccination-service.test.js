jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('sequelize', () => ({
  Op: {
    iLike: jest.fn(),
  },
}));

const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const {
  getAllVaccination,
  getVaccination,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} = require('../../api/src/modules/vaccination/vaccination.service');
const vaccinationRepository = require('../../api/src/modules/vaccination/vaccination.repository');
const animalRepository = require('../../api/src/modules/animal/animal.repository');

const {
  vaccination1,
  vaccination2,
  animal1,
  animal2,
} = require('./utils/fake-data');

jest.mock('../../api/src/modules/vaccination/vaccination.repository', () => ({
  findAllVaccinations: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../../api/src/modules/animal/animal.repository', () => ({
  findOne: jest.fn(),
}));

describe('Vaccination service', () => {
  const { userId, id: animalId } = animal1();
  const { id: vaccinationId } = vaccination1();

  describe('getAllVaccinations()', () => {
    const dbResponse = [
      vaccination1({ animal: { code: animal1().code } }),
      vaccination2({ animal: { vaccine: 'vaccine x', code: animal2().code } }),
    ];
    let query = null;
    Op.iLike.mockResolvedValue('Operation');

    beforeEach(() => {
      query = {
        vaccine: 'Ivermectin',
      };
    });

    test('It should return filtered vaccinations', async () => {
      vaccinationRepository.findAllVaccinations.mockResolvedValue([
        dbResponse[0],
      ]);

      const result = await getAllVaccination(userId, query);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(
        expect.objectContaining({
          id: dbResponse[0].id,
          vaccine: dbResponse[0].vaccine,
        }),
      );

      expect(vaccinationRepository.findAllVaccinations).toHaveBeenCalledTimes(
        1,
      );
      expect(vaccinationRepository.findAllVaccinations).toHaveBeenCalledWith(
        userId,
        expect.anything(),
      );
    });

    test('It should return filtered vaccinations', async () => {
      delete query.vaccine;
      query.animalId = animalId;
      vaccinationRepository.findAllVaccinations.mockResolvedValue(dbResponse);

      const result = await getAllVaccination(userId, query);

      expect(result).toHaveLength(2);
      expect(result[1]).toMatchObject(
        expect.objectContaining({
          id: dbResponse[1].id,
          vaccine: dbResponse[1].vaccine,
        }),
      );

      expect(vaccinationRepository.findAllVaccinations).toHaveBeenCalledTimes(
        1,
      );
      expect(vaccinationRepository.findAllVaccinations).toHaveBeenCalledWith(
        userId,
        { animalId: query.animalId },
      );
    });

    test('It should return an empty array if no vaccinations are found', async () => {
      vaccinationRepository.findAllVaccinations.mockResolvedValue([]);

      const result = await getAllVaccination(userId, query);

      expect(result).toEqual([]);
      expect(vaccinationRepository.findAllVaccinations).toHaveBeenCalledTimes(
        1,
      );
    });

    test('It should throw Boom error if query is not provided', async () => {
      await expect(getAllVaccination(userId, null)).rejects.toThrow(
        'was not provided',
      );

      expect(vaccinationRepository.findAllVaccinations).not.toHaveBeenCalled();
    });

    test('It should throw Boom error if userId is not provided', async () => {
      await expect(getAllVaccination(null, query)).rejects.toThrow(
        'was not provided',
      );

      expect(vaccinationRepository.findAllVaccinations).not.toHaveBeenCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getVaccination()', () => {
    const dbResponse = vaccination1();

    test('It should return a specific vaccination', async () => {
      vaccinationRepository.findOne.mockResolvedValue(dbResponse);

      const result = await getVaccination(userId, vaccinationId);

      expect(result).toEqual(
        expect.objectContaining({
          id: dbResponse.id,
          vaccine: dbResponse.vaccine,
        }),
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.findOne).toHaveBeenCalledWith(
        userId,
        vaccinationId,
      );
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(getVaccination(null, vaccinationId)).rejects.toThrow(
        /was not provided/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because vaccinationId was not provided', async () => {
      await expect(getVaccination(userId, null)).rejects.toThrow(
        /was not provided/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      vaccinationRepository.findOne.mockResolvedValue(null);

      await expect(getVaccination(userId, vaccinationId)).rejects.toThrow(
        /not exist/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('createVaccination()', () => {
    const dbResponse = vaccination1();
    const fakeUuid = 'fake-uuid-123';
    uuidv4.mockReturnValue(fakeUuid);

    let vaccinationData = null;

    beforeEach(() => {
      vaccinationData = {
        ...dbResponse,
        vaccine: 'new vaccine',
        description: null,
      };
    });

    test('It should return a new vaccination', async () => {
      vaccinationRepository.create.mockResolvedValue({
        ...dbResponse,
        id: fakeUuid,
        vaccine: vaccinationData.vaccine,
        description: vaccinationData.description,
      });
      animalRepository.findOne.mockResolvedValue(animal1());

      const result = await createVaccination(userId, vaccinationData);

      expect(result.id).toBe(fakeUuid);
      expect(result.vaccine).toBe(vaccinationData.vaccine);
      expect(result.description).toBe(null);
      expect(animalRepository.findOne).toHaveBeenCalledWith(
        userId,
        vaccinationData.animalId,
      );
      expect(vaccinationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: fakeUuid,
          vaccine: vaccinationData.vaccine,
          description: vaccinationData.description,
        }),
      );
    });

    test('It should return an error because animalId was not provided', async () => {
      delete vaccinationData.animalId;

      await expect(createVaccination(userId, vaccinationData)).rejects.toThrow(
        /not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because vaccine was not provided', async () => {
      delete vaccinationData.vaccine;

      await expect(createVaccination(userId, vaccinationData)).rejects.toThrow(
        /not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(createVaccination(null, vaccinationData)).rejects.toThrow(
        /not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      vaccinationRepository.create.mockResolvedValue(null);

      await expect(createVaccination(userId, vaccinationData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.create).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('updateVaccination()', () => {
    let vaccinationData = null;
    let dbResponse = null;

    beforeEach(() => {
      vaccinationData = { vaccine: 'vaccine x', description: 'description x' };

      dbResponse = {
        ...vaccination1(),
        vaccine: vaccinationData.vaccine,
        description: vaccinationData.description,
      };
    });

    test('It should return an updated vaccination', async () => {
      vaccinationRepository.findOne.mockResolvedValue(vaccination1());
      vaccinationRepository.update.mockResolvedValue([1, [dbResponse]]);

      const result = await updateVaccination(
        userId,
        vaccinationId,
        vaccinationData,
      );

      expect(result.id).toBe(vaccinationId);
      expect(result.vaccine).toBe(vaccinationData.vaccine);
      expect(result.description).toBe(vaccinationData.description);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an updated vaccination with only name updated', async () => {
      delete vaccinationData.description;

      vaccinationRepository.findOne.mockResolvedValue(vaccination1());
      vaccinationRepository.update.mockResolvedValue([1, [dbResponse]]);

      const result = await updateVaccination(
        userId,
        vaccinationId,
        vaccinationData,
      );

      expect(result.id).toBe(vaccinationId);
      expect(result.vaccine).toBe(vaccinationData.vaccine);
      expect(result.description).not.toBe(vaccinationData.description);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the vaccination to be updated does not exist', async () => {
      vaccinationRepository.findOne.mockResolvedValue(null);

      await expect(
        updateVaccination(userId, vaccinationId, vaccinationData),
      ).rejects.toThrow(/does not exist/);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      vaccinationRepository.findOne.mockResolvedValue(vaccination1());
      vaccinationRepository.update.mockResolvedValue([0, [null]]);

      await expect(
        updateVaccination(userId, vaccinationId, vaccinationData),
      ).rejects.toThrow(/Something went wrong/);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because There is no data to update', async () => {
      vaccinationRepository.findOne.mockResolvedValue(vaccination1());
      delete vaccinationData.vaccine;
      delete vaccinationData.description;

      await expect(
        updateVaccination(userId, vaccinationId, vaccinationData),
      ).rejects.toThrow(/was not provided/);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(
        updateVaccination(null, vaccinationId, vaccinationData),
      ).rejects.toThrow(/was not provided/);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because vaccinationId was not provided', async () => {
      await expect(
        updateVaccination(userId, null, vaccinationData),
      ).rejects.toThrow(/was not provided/);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.update).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('deleteVaccination()', () => {
    test('It should return a deleted vaccination', async () => {
      vaccinationRepository.findOne.mockResolvedValue(vaccination1());
      vaccinationRepository.destroy.mockResolvedValue(1);

      const result = await deleteVaccination(userId, vaccinationId);

      expect(result).toBe(1);
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.destroy).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(deleteVaccination(null, vaccinationId)).rejects.toThrow(
        /was not provided/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because vaccinationId was not provided', async () => {
      await expect(deleteVaccination(userId, null)).rejects.toThrow(
        /was not provided/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(0);
      expect(vaccinationRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the vaccination does not exist', async () => {
      vaccinationRepository.findOne.mockResolvedValue(null);

      await expect(deleteVaccination(userId, vaccinationId)).rejects.toThrow(
        /does not exist/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      vaccinationRepository.findOne.mockResolvedValue(vaccination1());
      vaccinationRepository.destroy.mockResolvedValue(0);

      await expect(deleteVaccination(userId, vaccinationId)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(vaccinationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(vaccinationRepository.destroy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
