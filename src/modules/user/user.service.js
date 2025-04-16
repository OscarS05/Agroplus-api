const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { config } = require('../../../config/config');
const userRepository = require('./user.repository');

const getAllUsers = async () => {
  return await userRepository.findAllUsers();
}

const getUser = async (userId) => {
  return await userRepository.findOne(userId);
}

const createUser = async (userData) => {
  const userAlreadyExist = await userRepository.findOneByEmail(userData.email);
  if(userAlreadyExist?.id) throw Boom.conflict('User already exists');

  const user = {
    name: userData?.name,
    email: userData?.email,
    password: await bcrypt.hash(userData?.password, 10),
    role: 'basic',
    createdAt: new Date().toISOString().split('T')[0],
  }

  const newUser = await userRepository.create(user);
  if(!newUser?.id) throw Boom.badRequest('Something went wrong creating the user');

  delete newUser?.password;
  return newUser;
}

const login = async (userCredentials) => {
  const user = await userRepository.findOneByEmailToLogin(userCredentials.email);
  if(!user?.id) throw Boom.conflict('User does not exists');

  const isMatch = await bcrypt.compare(userCredentials.password, user.password);
  if(!isMatch) throw Boom.unauthorized('The password is incorrect');

  const accessToken = generateToken(user);
  await userRepository.update(user.id, { token: accessToken });

  return { user, accessToken };
}

const generateToken = (user) => {
  const payload = {
    sub: user?.id || user?.sub,
    role: user.role
  }

  const accessToken = jwt.sign(payload, config.jwtAccessSecret, { expiresIn: '60m' });
  return accessToken;
}

module.exports = {
  getUser,
  createUser,
  getAllUsers,
  login,
}
