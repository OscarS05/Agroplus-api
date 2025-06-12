jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuidv4 } = require('uuid');

const {
  getAllAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} = require('../../api/src/modules/animal/animal.service');
const animalRepository = require('../../api/src/modules/animal/animal.repository');

const {
  animal1,
  animal2,
  animal3,
  user2,
  animal4,
  user1,
} = require('./utils/fake-data');

jest.mock('../../api/src/modules/animal/animal.repository', () => ({
  findAllAnimals: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Animal service', () => {
  describe('getAllAnimals()', () => {
    const dbResponse = [
      animal1({
        user: {
          id: user1().id,
          name: user1().name,
        },
      }),
      animal2({
        user: {
          id: user1().id,
          name: user1().name,
        },
      }),
      animal3({
        user: {
          id: user1().id,
          name: user1().name,
        },
        mother: {
          id: animal2().id,
          code: animal2().code,
          breed: animal2().breed,
        },
        father: {
          id: animal1().id,
          code: animal1().code,
          breed: animal1().breed,
        },
      }),
    ];
    let query = null;

    beforeEach(() => {
      query = {
        userId: dbResponse[0].userId,
      };
    });

    test('It should return formatted animals when data exists', async () => {
      animalRepository.findAllAnimals.mockResolvedValue(dbResponse);

      const result = await getAllAnimals(query);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: dbResponse[0].id,
          livestockType: dbResponse[0].livestockType,
          animalType: dbResponse[0].animalType,
          breed: dbResponse[0].breed,
          code: dbResponse[0].code,
          sex: dbResponse[0].sex,
          mother: null,
          father: null,
          birthDate: null,
          registeredAt: expect.any(String),
        }),
      );

      expect(result[2]).toEqual(
        expect.objectContaining({
          id: dbResponse[2].id,
          livestockType: dbResponse[2].livestockType,
          animalType: dbResponse[2].animalType,
          breed: dbResponse[2].breed,
          code: dbResponse[2].code,
          sex: dbResponse[2].sex,
          mother: dbResponse[2].mother.code,
          father: dbResponse[2].father.code,
          registeredAt: expect.any(String),
        }),
      );

      expect(animalRepository.findAllAnimals).toHaveBeenCalledTimes(1);
      expect(animalRepository.findAllAnimals).toHaveBeenCalledWith({
        userId: query.userId,
      });
    });

    test('It should return an empty array if no animals are found', async () => {
      animalRepository.findAllAnimals.mockResolvedValue([]);

      const result = await getAllAnimals(query);

      expect(result).toEqual([]);
      expect(animalRepository.findAllAnimals).toHaveBeenCalledTimes(1);
    });

    test('It should throw Boom error if query is not provided', async () => {
      await expect(getAllAnimals()).rejects.toThrow('query was not provided');
      await expect(getAllAnimals()).rejects.toThrow(/was not provided/);

      expect(animalRepository.findAllAnimals).not.toHaveBeenCalled();
    });

    test('It should filter animals with specific criteria', async () => {
      query = {
        userId: '44c5da38-bb82-4659-b84a-f6be63e300fc',
        breed: 'Angus',
        code: 'ABC-123',
      };
      animalRepository.findAllAnimals.mockResolvedValue([dbResponse[0]]);

      const result = await getAllAnimals(query);

      expect(animalRepository.findAllAnimals).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: query.userId,
          breed: expect.any(Object),
          code: query.code,
        }),
      );
      expect(result.length).toBe(1);
      expect(result[0].code).toBe(query.code);
    });

    test('All angus breed animals must be returned', async () => {
      query = {
        userId: '44c5da38-bb82-4659-b84a-f6be63e300fc',
        breed: 'Angus',
      };
      animalRepository.findAllAnimals.mockResolvedValue(dbResponse);

      const result = await getAllAnimals(query);

      expect(animalRepository.findAllAnimals).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: query.userId,
          breed: expect.any(Object),
        }),
      );
      expect(result.length).toBe(3);
      result.forEach((animal) => expect(animal.breed).toEqual('Angus'));
    });

    test('It should return an animal filtered by user2', async () => {
      query = {
        userId: user2().id,
      };
      animalRepository.findAllAnimals.mockResolvedValue([
        animal4({
          user: {
            id: user2().id,
            name: user2().name,
          },
        }),
      ]);

      const result = await getAllAnimals(query);

      expect(animalRepository.findAllAnimals).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: query.userId,
        }),
      );
      expect(result.length).toBe(1);
      expect(result[0].code).toBe(animal4().code);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getAnimal()', () => {
    const { userId, id: animalId } = animal1();
    const dbResponse = animal1({
      user: {
        id: user1().id,
        name: user1().name,
      },
    });

    test('It should return a formatted animal', async () => {
      animalRepository.findOne.mockResolvedValue(dbResponse);

      const result = await getAnimal(userId, animalId);

      expect(result).toEqual(
        expect.objectContaining({
          id: dbResponse.id,
          livestockType: dbResponse.livestockType,
          animalType: dbResponse.animalType,
          breed: dbResponse.breed,
          code: dbResponse.code,
          sex: dbResponse.sex,
          mother: null,
          father: null,
          birthDate: null,
          registeredAt: expect.any(String),
        }),
      );

      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
      expect(animalRepository.findOne).toHaveBeenCalledWith(userId, animalId);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(getAnimal(null, animalId)).rejects.toThrow(
        /was not provided/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because animalId was not provided', async () => {
      await expect(getAnimal(userId, null)).rejects.toThrow(/was not provided/);
      expect(animalRepository.findOne).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      animalRepository.findOne.mockResolvedValue(null);

      await expect(getAnimal(userId, animalId)).rejects.toThrow(/not exist/);
      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('createAnimal()', () => {
    const dbReponse = animal1();
    const fakeUuid = 'fake-uuid-123';
    uuidv4.mockReturnValue(fakeUuid);

    let animalData = null;

    beforeEach(() => {
      animalData = { ...dbReponse };
    });

    test('It should return a new animal', async () => {
      animalRepository.create.mockResolvedValue({ ...dbReponse, id: fakeUuid });

      const result = await createAnimal(animalData);

      expect(result.id).toBe(fakeUuid);
      expect(result.code).toBe(animalData.code);
      expect(animalRepository.create).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because some values were not provided', async () => {
      delete animalData.breed;

      await expect(createAnimal(animalData)).rejects.toThrow(/not provided/);
    });

    test('It should return an error because the db failed', async () => {
      animalRepository.create.mockResolvedValue(null);

      await expect(createAnimal(animalData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(animalRepository.create).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('updateAnimal()', () => {
    let dbReponse = null;
    const { userId, id: animalId } = animal1();

    let animalData = null;

    beforeEach(() => {
      animalData = { code: 'LMN-456', sex: 'Female' };

      dbReponse = { ...animal1(), code: animalData.code, sex: animalData.sex };
    });

    test('It should return an updated animal', async () => {
      animalRepository.findOne.mockResolvedValue(animal1());
      animalRepository.update.mockResolvedValue([1, [dbReponse]]);

      const result = await updateAnimal(userId, animalId, animalData);

      expect(result.id).toBe(animalId);
      expect(result.code).toBe(animalData.code);
      expect(result.sex).toBe(animalData.sex);
      expect(animalRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the animal to be updated does not exist', async () => {
      animalRepository.findOne.mockResolvedValue(null);

      await expect(updateAnimal(userId, animalId, animalData)).rejects.toThrow(
        /does not exist/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
      expect(animalRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      animalRepository.findOne.mockResolvedValue(animal1());
      animalRepository.update.mockResolvedValue([0, [null]]);

      await expect(updateAnimal(userId, animalId, animalData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
      expect(animalRepository.update).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because There is no data to update', async () => {
      animalRepository.findOne.mockResolvedValue(animal1());
      delete animalData.code;
      delete animalData.sex;

      await expect(updateAnimal(userId, animalId, animalData)).rejects.toThrow(
        /no data|No data/,
      );
      expect(animalRepository.findOne).toHaveBeenCalledTimes(1);
      expect(animalRepository.update).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      animalRepository.findOne.mockResolvedValue(animal1());
      animalRepository.update.mockResolvedValue([0, [null]]);

      await expect(updateAnimal(userId, animalId, animalData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(animalRepository.update).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('deleteAnimal()', () => {
    const { userId, id: animalId } = animal1();

    test('It should return an updated animal', async () => {
      animalRepository.destroy.mockResolvedValue(1);

      const result = await deleteAnimal(userId, animalId);

      expect(result).toBe(1);
      expect(animalRepository.destroy).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because userId was not provided', async () => {
      await expect(deleteAnimal(null, animalId)).rejects.toThrow(
        /was not provided/,
      );
      expect(animalRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because animalId was not provided', async () => {
      await expect(deleteAnimal(userId, null)).rejects.toThrow(
        /was not provided/,
      );
      expect(animalRepository.destroy).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed', async () => {
      animalRepository.destroy.mockResolvedValue(0);

      await expect(deleteAnimal(userId, animalId)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(animalRepository.destroy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
