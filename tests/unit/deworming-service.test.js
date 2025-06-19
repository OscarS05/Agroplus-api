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
  getAllDeworming,
  getDeworming,
  createDeworming,
  updateDeworming,
  deleteDeworming,
} = require('../../api/src/modules/deworming/deworming.service');
const dewormingRepository = require('../../api/src/modules/deworming/deworming.repository');
const animalRepository = require('../../api/src/modules/animal/animal.repository');

const {
  deworming1,
  deworming2,
  animal1,
  animal2,
} = require('./utils/fake-data');

jest.mock('../../api/src/modules/deworming/deworming.repository', () => ({
  findAllDewormings: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../../api/src/modules/animal/animal.repository', () => ({
  findAllDewormings: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Deworming service', () => {
  describe('getAllDewormings()', () => {
    const dbResponse = [
      deworming1({ animal: { code: animal1().code } }),
      deworming2({ animal: { dewormer: 'dewormer x', code: animal2().code } }),
    ];
    const { userId, id: animalId } = animal1();
    let query = null;
    Op.iLike.mockResolvedValue('Operation');

    beforeEach(() => {
      query = {
        dewormer: 'Ivermectin',
      };
    });

    test('It should return filtered dewormings', async () => {
      dewormingRepository.findAllDewormings.mockResolvedValue([dbResponse[0]]);

      const result = await getAllDeworming(userId, query);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(
        expect.objectContaining({
          id: dbResponse[0].id,
          dewormer: dbResponse[0].dewormer,
        }),
      );

      expect(dewormingRepository.findAllDewormings).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.findAllDewormings).toHaveBeenCalledWith(
        userId,
        expect.anything(),
      );
    });

    test('It should return filtered dewormings', async () => {
      delete query.dewormer;
      query.animalId = animalId;
      dewormingRepository.findAllDewormings.mockResolvedValue(dbResponse);

      const result = await getAllDeworming(userId, query);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(
        expect.objectContaining({
          id: dbResponse[0].id,
          dewormer: dbResponse[0].dewormer,
        }),
      );

      expect(dewormingRepository.findAllDewormings).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.findAllDewormings).toHaveBeenCalledWith(
        userId,
        { where: { animalId: query.animalId }, limit: 10, offset: 0 },
      );
    });

    test('It should return an empty array if no dewormings are found', async () => {
      dewormingRepository.findAllDewormings.mockResolvedValue([]);

      const result = await getAllDeworming(userId, query);

      expect(result).toEqual([]);
      expect(dewormingRepository.findAllDewormings).toHaveBeenCalledTimes(1);
    });

    test('It should throw Boom error if query is not provided', async () => {
      await expect(getAllDeworming(userId, null)).rejects.toThrow(
        'query was not provided',
      );

      expect(dewormingRepository.findAllDewormings).not.toHaveBeenCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getDeworming()', () => {
    const { userId } = animal1();
    const { id: dewormingId } = deworming1();
    const dbResponse = deworming1();

    test('It should return a specific deworming', async () => {
      dewormingRepository.findOne.mockResolvedValue(dbResponse);

      const result = await getDeworming(userId, dewormingId);

      expect(result).toEqual(
        expect.objectContaining({
          id: dbResponse.id,
          dewormer: dbResponse.dewormer,
        }),
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.findOne).toHaveBeenCalledWith(
        userId,
        dewormingId,
      );
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(getDeworming(null, dewormingId)).rejects.toThrow(
        /was not provided/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because dewormingId was not provided', async () => {
      await expect(getDeworming(userId, null)).rejects.toThrow(
        /was not provided/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      dewormingRepository.findOne.mockResolvedValue(null);

      await expect(getDeworming(userId, dewormingId)).rejects.toThrow(
        /not exist/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('createDeworming()', () => {
    const { userId } = animal1();
    const dbReponse = deworming1();
    const fakeUuid = 'fake-uuid-123';
    uuidv4.mockReturnValue(fakeUuid);

    let dewormingData = null;

    beforeEach(() => {
      dewormingData = { ...dbReponse };
    });

    test('It should return a new deworming', async () => {
      dewormingRepository.create.mockResolvedValue({
        ...dbReponse,
        id: fakeUuid,
      });
      animalRepository.findOne.mockResolvedValue(animal1());
      dewormingRepository.findOne.mockResolvedValueOnce({
        ...dbReponse,
        id: fakeUuid,
      });

      const result = await createDeworming(userId, dewormingData);

      expect(result.id).toBe(fakeUuid);
      expect(result.dewormer).toBe(dewormingData.dewormer);
      expect(animalRepository.findOne).toHaveBeenCalledWith(
        userId,
        dewormingData.animalId,
      );
      expect(dewormingRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: fakeUuid,
          dewormer: dewormingData.dewormer,
          description: dewormingData.description,
        }),
      );
    });

    test('It should return an error because animalId was not provided', async () => {
      delete dewormingData.animalId;

      await expect(createDeworming(userId, dewormingData)).rejects.toThrow(
        /not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because dewormer was not provided', async () => {
      delete dewormingData.dewormer;

      await expect(createDeworming(userId, dewormingData)).rejects.toThrow(
        /not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(createDeworming(null, dewormingData)).rejects.toThrow(
        /not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      dewormingRepository.create.mockResolvedValue(null);

      await expect(createDeworming(userId, dewormingData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.create).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('updateDeworming()', () => {
    let dbReponse = null;
    const { userId } = animal1();
    const { id: dewormingId } = deworming1();

    let dewormingData = null;

    beforeEach(() => {
      dewormingData = { dewormer: 'dewormer x', description: 'description x' };

      dbReponse = {
        ...deworming1(),
        dewormer: dewormingData.dewormer,
        description: dewormingData.description,
      };
    });

    test('It should return an updated deworming', async () => {
      dewormingRepository.findOne.mockResolvedValueOnce(deworming1());
      dewormingRepository.update.mockResolvedValue([1, [dbReponse]]);
      dewormingRepository.findOne.mockResolvedValueOnce(dbReponse);

      const result = await updateDeworming(userId, dewormingId, dewormingData);

      expect(result.id).toBe(dewormingId);
      expect(result.dewormer).toBe(dewormingData.dewormer);
      expect(result.description).toBe(dewormingData.description);
      expect(dewormingRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the deworming to be updated does not exist', async () => {
      dewormingRepository.findOne.mockResolvedValue(null);

      await expect(
        updateDeworming(userId, dewormingId, dewormingData),
      ).rejects.toThrow(/does not exist/);
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      dewormingRepository.findOne.mockResolvedValue(deworming1());
      dewormingRepository.update.mockResolvedValue([0, [null]]);

      await expect(
        updateDeworming(userId, dewormingId, dewormingData),
      ).rejects.toThrow(/Something went wrong/);
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because There is no data to update', async () => {
      dewormingRepository.findOne.mockResolvedValue(deworming1());
      delete dewormingData.dewormer;
      delete dewormingData.description;

      await expect(
        updateDeworming(userId, dewormingId, dewormingData),
      ).rejects.toThrow(/was not provided/);
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(
        updateDeworming(null, dewormingId, dewormingData),
      ).rejects.toThrow(/was not provided/);
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because dewormingId was not provided', async () => {
      await expect(
        updateDeworming(userId, null, dewormingData),
      ).rejects.toThrow(/was not provided/);
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.update).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('deleteDeworming()', () => {
    const { userId } = animal1();
    const { id: dewormingId } = deworming1();

    test('It should return an deleted deworming', async () => {
      dewormingRepository.findOne.mockResolvedValue(deworming1());
      dewormingRepository.destroy.mockResolvedValue(1);

      const result = await deleteDeworming(userId, dewormingId);

      expect(result).toBe(1);
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.destroy).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(deleteDeworming(null, dewormingId)).rejects.toThrow(
        /was not provided/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because dewormingId was not provided', async () => {
      await expect(deleteDeworming(userId, null)).rejects.toThrow(
        /was not provided/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(0);
      expect(dewormingRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the deworming does not exist', async () => {
      dewormingRepository.findOne.mockResolvedValue(null);

      await expect(deleteDeworming(userId, dewormingId)).rejects.toThrow(
        /does not exist/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      dewormingRepository.findOne.mockResolvedValue(deworming1());
      dewormingRepository.destroy.mockResolvedValue(0);

      await expect(deleteDeworming(userId, dewormingId)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(dewormingRepository.findOne).toHaveBeenCalledTimes(1);
      expect(dewormingRepository.destroy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
