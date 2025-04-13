const Boom = require('@hapi/boom');

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
    const { userId } = req.params;

    const user = await userService.getUser(userId);

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

    const user = await userService.login(userData);
    if(!user?.id) throw Boom.badRequest('Create user operation returns null');

    res.status(200).json({ message: 'User authenticated successfully', success: true });
  } catch (error) {
    next(error);
  }
}

const updateUser = async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
}


module.exports = {
  getOneUser,
  createUser,
  login,
  updateUser,
  getAllUsers,
}
