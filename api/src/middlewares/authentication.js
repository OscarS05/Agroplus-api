const Boom = require('@hapi/boom');
const { rateLimit } = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const { config } = require('../../config/config');

const userRepository = require('../modules/user/user.repository');

const limiter = (limit, windowMs, message) =>
  rateLimit({
    windowMs,
    limit,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  });

const validateSession = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) throw Boom.unauthorized('Access token was not provided');

    let decodedAccessToken = null;

    try {
      decodedAccessToken = jwt.verify(accessToken, config.jwtAccessSecret);
    } catch (error) {
      throw Boom.badRequest(
        `Error verifying the accessToken: ${error.message}`,
      );
    }

    if (!decodedAccessToken?.sub)
      throw Boom.unauthorized('Access token has expired');

    const user = await userRepository.findOneToValidateSession(
      decodedAccessToken.sub,
      accessToken,
    );
    if (!user?.id) throw Boom.unauthorized('Invalid access token');

    req.user = decodedAccessToken;
    req.tokens = { accessToken };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { validateSession, limiter };
