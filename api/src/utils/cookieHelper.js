const { config } = require('../../config/config');

const isProduction = config.env === 'production';

const setCookieAccessToken = (res, value) => {
  res.cookie('accessToken', value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'Lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

const clearCookie = (res, name) => {
  res.cookie(name, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'Lax',
    expires: new Date(0)
  });
}

module.exports = { setCookieAccessToken, clearCookie };
