const Boom = require('@hapi/boom');

const userService = require('./user.service');

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
  updateUser,
}
