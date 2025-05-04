const Boom = require('@hapi/boom');
const { rateLimit } = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const { config } = require('../../config/config');

const userRepository = require('../modules/user/user.repository');

const limiter = (limit, windowMs, message) => rateLimit( {
  windowMs: windowMs,
  limit: limit,
  message: message,
  standardHeaders: true,
  legacyHeaders: false,
});

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

module.exports = { validateSession, limiter };
