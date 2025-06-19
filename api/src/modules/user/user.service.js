const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { config } = require('../../../config/config');
const userRepository = require('./user.repository');

const generateToken = (user) => {
  const payload = {
    sub: user?.id || user?.sub,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: '15d',
  });
  return accessToken;
};

const buildFilters = (query) => {
  const { limit = 15, offset = 0 } = query;

  return {
    limit: limit ?? parseInt(limit, 10),
    offset: offset ?? parseInt(offset, 10),
  };
};

const getAllUsers = async (query) => {
  if (!query || typeof query !== 'object') {
    throw Boom.badRequest(
      'query were not provided or does not have the correct type',
    );
  }

  const filters = buildFilters(query);

  return userRepository.findAllUsers(filters);
};

const getUser = async (userId) => {
  if (!userId) {
    throw Boom.badRequest('userId was not provided');
  }

  const user = await userRepository.findOne(userId);

  if (!user?.id) {
    throw Boom.notFound('User was not found');
  }

  return user;
};

const getUserByEmail = async (email) => {
  if (!email) {
    throw Boom.badRequest('email was not provided');
  }

  const user = await userRepository.findOneByEmail(email);

  if (!user?.id) {
    throw Boom.badRequest('user was not found');
  }

  return user;
};

const createUser = async (userData) => {
  if (!userData?.email || !userData?.password || !userData?.name) {
    throw Boom.badRequest('userData was not provided');
  }

  const userAlreadyExist = await userRepository.findOneByEmail(userData.email);
  if (userAlreadyExist?.id) throw Boom.conflict('User already exists');

  const user = {
    id: uuidv4(),
    name: userData.name,
    email: userData.email,
    password: await bcrypt.hash(userData.password, 10),
    role: 'basic',
    createdAt: new Date().toISOString(),
  };

  const newUser = await userRepository.create(user);

  if (!newUser?.id) {
    throw Boom.badRequest('Something went wrong creating the user');
  }

  delete newUser?.password;
  return newUser;
};

const login = async (userCredentials) => {
  if (!userCredentials?.email || !userCredentials?.password) {
    throw Boom.badRequest('userCredentials was not provided');
  }

  const user = await userRepository.findOneByEmailToLogin(
    userCredentials.email,
  );
  if (!user?.id) throw Boom.conflict('User does not exists');

  const isMatch = await bcrypt.compare(userCredentials.password, user.password);
  if (!isMatch) throw Boom.unauthorized('The password is incorrect');

  const accessToken = generateToken(user);

  if (!accessToken) {
    throw Boom.internal('Something went wrong signing the token');
  }

  await userRepository.update(user.id, { token: accessToken });

  if (user && typeof user.get === 'function') {
    delete user.get({ plain: true }).password;
    delete user.get({ plain: true }).password;
  } else {
    delete user.password;
    delete user.token;
  }

  return { user, accessToken };
};

module.exports = {
  getUserByEmail,
  getUser,
  createUser,
  getAllUsers,
  login,
};
