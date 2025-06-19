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

const handlerValidateSession = async (req) => {
  let decodedAccessToken = null;
  let accessToken = null;

  try {
    if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    } else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        [, accessToken] = authHeader.split(' ');
      } else {
        throw Boom.unauthorized('Invalid authorization header format');
      }
    }

    decodedAccessToken = jwt.verify(accessToken, config.jwtAccessSecret);
  } catch (error) {
    throw Boom.badRequest(`Error verifying the accessToken: ${error.message}`);
  }

  if (!decodedAccessToken?.sub) {
    throw Boom.unauthorized('Access token has expired');
  }

  const user = await userRepository.findOneToValidateSession(
    decodedAccessToken.sub,
    accessToken,
  );

  if (!user?.id) throw Boom.unauthorized('Invalid access token');

  return { user, decodedAccessToken, accessToken };
};

const validateSession = async (req, res, next) => {
  try {
    const { decodedAccessToken, accessToken } =
      await handlerValidateSession(req);

    req.user = decodedAccessToken;
    req.tokens = { accessToken };
    return next();
  } catch (error) {
    return next(error);
  }
};

const validateGraphQLSession = async (req) => {
  try {
    const { user } = await handlerValidateSession(req);
    return user;
  } catch (error) {
    throw Boom.unauthorized('GraphQL session validation failed');
  }
};

module.exports = { validateSession, limiter, validateGraphQLSession };
