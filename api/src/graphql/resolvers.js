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
const {
  query: dewormingQueries,
  mutation: dewormingMutation,
} = require('./resolvers/deworming/index');
const {
  query: vaccinationQueries,
  mutation: vaccinationMutation,
} = require('./resolvers/vaccination/index');

const resolvers = {
  Query: {
    hello: () => 'Hello world!',

    ...userQueries,
    ...animalQueries,
    ...dewormingQueries,
    ...vaccinationQueries,
  },
  Mutation: {
    ...userMutations,
    ...animalMutation,
    ...dewormingMutation,
    ...vaccinationMutation,
  },

  NameType,
  PasswordType,
};

module.exports = { resolvers };
