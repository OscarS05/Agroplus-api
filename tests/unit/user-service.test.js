jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const {
  createUser,
  getAllUsers,
  getUser,
  getUserByEmail,
  login,
} = require('../../api/src/modules/user/user.service');
const userRepository = require('../../api/src/modules/user/user.repository');

const { user1, user2 } = require('./utils/fake-data');

jest.mock('../../api/src/modules/user/user.repository', () => ({
  findAllUsers: jest.fn(),
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  create: jest.fn(),
  findOneByEmailToLogin: jest.fn(),
  update: jest.fn(),
}));

describe('User service', () => {
  describe('getAllUsers()', () => {
    const dbReponse = [user1(), user2()];

    test('It should return all users', async () => {
      userRepository.findAllUsers.mockResolvedValue(dbReponse);

      const result = await getAllUsers();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(2);
      expect(userRepository.findAllUsers).toHaveBeenCalledTimes(1);
    });

    test('It should return an empty array', async () => {
      userRepository.findAllUsers.mockResolvedValue([]);

      const result = await getAllUsers();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(0);
      expect(userRepository.findAllUsers).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the db failed', async () => {
      userRepository.findAllUsers.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(getAllUsers()).rejects.toThrow('Something went wrong');
      expect(userRepository.findAllUsers).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getUser()', () => {
    const dbReponse = user1();
    const userId = dbReponse.id;

    test('It should return a users', async () => {
      userRepository.findOne.mockResolvedValue(dbReponse);

      const result = await getUser(userId);
      expect(result.id).toBeDefined();
      expect(result.email).toBe(dbReponse.email);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the user was not found', async () => {
      userRepository.findOne.mockResolvedValue({});

      await expect(getUser(userId)).rejects.toThrow(/was not found/);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because userId was not found', async () => {
      await expect(getUser(null)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOne).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getUserByEmail()', () => {
    const dbReponse = user1();
    const { email } = dbReponse;

    test('It should return a users', async () => {
      userRepository.findOneByEmail.mockResolvedValue(dbReponse);

      const result = await getUserByEmail(email);
      expect(result.id).toBeDefined();
      expect(result.email).toBe(dbReponse.email);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because the user was not found', async () => {
      userRepository.findOneByEmail.mockResolvedValue({});

      await expect(getUserByEmail(email)).rejects.toThrow(/was not found/);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    });

    test('It should return an error because email was not found', async () => {
      await expect(getUserByEmail(null)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('createUser()', () => {
    const hashedPassword = 'fake-hash-123';
    let userData = null;
    let dbReponse = null;

    beforeEach(() => {
      userData = {
        name: 'user3',
        email: 'user3@email.com',
        password: 'Admin123@',
      };

      uuidv4.mockReturnValue('fake-uuid-123');
      bcrypt.hash.mockResolvedValue(hashedPassword);

      dbReponse = { ...user1(userData) };
    });

    test('It should return a new user', async () => {
      userRepository.create.mockResolvedValue(dbReponse);
      userRepository.findOneByEmail.mockResolvedValue({});

      const result = await createUser(userData);
      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(result.password).not.toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(uuidv4).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        }),
      );
    });

    test('It should return an error because the email was not provided in userData', async () => {
      delete userData.email;
      userRepository.findOneByEmail.mockResolvedValue({});

      await expect(createUser(userData)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(0);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the password was not provided in userData', async () => {
      delete userData.password;
      userRepository.findOneByEmail.mockResolvedValue({});

      await expect(createUser(userData)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(0);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the name was not provided in userData', async () => {
      delete userData.name;
      userRepository.findOneByEmail.mockResolvedValue({});

      await expect(createUser(userData)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(0);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the user already exists', async () => {
      userRepository.findOneByEmail.mockResolvedValue(user1());

      await expect(createUser(userData)).rejects.toThrow(/already exists/);
      expect(userRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the db failed creating the user', async () => {
      userRepository.create.mockResolvedValue({});
      userRepository.findOneByEmail.mockResolvedValue({});

      await expect(createUser(userData)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(userRepository.create).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('login()', () => {
    const user = user1();
    const token = 'fake-token-123';
    let userCredentials = null;

    beforeEach(() => {
      userCredentials = {
        email: 'user1@email.com',
        password: 'Admin123@',
      };

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);
    });

    test('It should return a new user', async () => {
      userRepository.findOneByEmailToLogin.mockResolvedValue(user);

      const { user: userResult, accessToken } = await login(userCredentials);
      expect(userResult.id).toBeDefined();
      expect(userResult.email).toBe(userCredentials.email);
      expect(userResult.password).not.toBeDefined();
      expect(accessToken).toBeDefined();
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmailToLogin).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledWith(user.id, { token });
    });

    test('It should return an error because the email was not provided in userCredentials', async () => {
      delete userCredentials.email;

      await expect(login(userCredentials)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOneByEmailToLogin).toHaveBeenCalledTimes(0);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the password was not provided in userCredentials', async () => {
      delete userCredentials.password;

      await expect(login(userCredentials)).rejects.toThrow(/was not provided/);
      expect(userRepository.findOneByEmailToLogin).toHaveBeenCalledTimes(0);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the user does not exists', async () => {
      userRepository.findOneByEmailToLogin.mockResolvedValue(null);

      await expect(login(userCredentials)).rejects.toThrow(/does not exists/);
      expect(userRepository.findOneByEmailToLogin).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    test('It should return an error because the jwt failed signing the token', async () => {
      userRepository.findOneByEmailToLogin.mockResolvedValue(user);
      jwt.sign.mockReturnValue(null);

      await expect(login(userCredentials)).rejects.toThrow(
        /Something went wrong/,
      );
      expect(userRepository.findOneByEmailToLogin).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
