const Boom = require('@hapi/boom');
const { config } = require('../../config/config');
const jwt = require('jsonwebtoken');

const userRepository = require('../modules/user/user.repository');

const validateSession = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if(!accessToken) throw Boom.unauthorized('Access token was not provided');

    const decodedAccessToken = jwt.verify(accessToken, config.jwtAccessSecret)
    if(!decodedAccessToken?.sub) throw Boom.unauthorized('Access token has expired');

    const user = await userRepository.findOneToValidateSession(decodedAccessToken.sub, accessToken);
    if(!user?.id) throw Boom.unauthorized('Invalid access token');

    req.user = decodedAccessToken;
    req.tokens = { accessToken };
    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validateSession };
