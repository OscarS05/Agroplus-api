const Boom = require('@hapi/boom');

const cookieHelpers = require('../../utils/cookieHelper');
const userService = require('./user.service');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

const getOneUser = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await userService.getUserByEmail(email);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;

    const newUser = await userService.createUser(userData);
    if(!newUser?.id) throw Boom.badRequest('Create user operation returns null');

    res.status(201).json({ message: 'User was successfully created', success: true });
  } catch (error) {
    next(error);
  }
}

const login = async (req, res, next) => {
  try {
    const userData = req.body;

    const { user, accessToken } = await userService.login(userData);
    if(!user?.id) throw Boom.badRequest('Create user operation returns null');
    if(!accessToken) throw Boom.unauthorized('Invalid credentials');

    cookieHelpers.setCookieAccessToken(res, accessToken);

    res.status(200).json({ message: 'User authenticated successfully', success: true, accessToken });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getOneUser,
  createUser,
  login,
  getAllUsers,
}
