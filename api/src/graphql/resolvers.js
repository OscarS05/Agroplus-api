const {
  NameType,
  PasswordType,
} = require('./resolvers/custom-types/custom-types');
const {
  query: userQueries,
  mutation: userMutations,
} = require('./resolvers/user/index');
const {
  query: animalQueries,
  mutation: animalMutation,
} = require('./resolvers/animal/index');

const resolvers = {
  Query: {
    hello: () => 'Hello world!',

    ...userQueries,
    ...animalQueries,
  },
  Mutation: {
    ...userMutations,
    ...animalMutation,
  },

  NameType,
  PasswordType,
};

module.exports = { resolvers };
