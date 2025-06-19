const {
  NameType,
  PasswordType,
} = require('./resolvers/custom-types/custom-types');
const {
  query: userQueries,
  mutation: userMutations,
} = require('./resolvers/user/index');

const resolvers = {
  Query: {
    hello: () => 'Hello world!',

    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },

  NameType,
  PasswordType,
};

module.exports = { resolvers };
