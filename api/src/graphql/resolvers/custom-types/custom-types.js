const { RegularExpression } = require('graphql-scalars');

const NameType = new RegularExpression(
  'NameType',
  /^[a-zA-ZÀ-ÿ ]{3,80}$/,
  'Name must contain only letters and spaces.',
);

const PasswordType = new RegularExpression(
  'PasswordType',
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=:|,.<>\\/?])[a-zA-Z0-9!@#$%^&*()_+\-=:|,.<>\\/?]{8,35}$/,
  'Password must contain at least 1 capital, 1 number and 1 special character.',
);

module.exports = {
  NameType,
  PasswordType,
};
