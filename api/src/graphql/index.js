const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require('@apollo/server/plugin/landingPage/default');
const { loadFiles } = require('@graphql-tools/load-files');
const {
  typeDefs: scalarsTypeDefs,
  resolvers: scalarsResolvers,
} = require('graphql-scalars');

const { resolvers } = require('./resolvers');

const useGraphQl = async (app) => {
  const typeDefs = [
    ...(await loadFiles('./api/src/**/*.graphql')),
    scalarsTypeDefs,
  ];
  const allResolvers = [resolvers, scalarsResolvers];

  const server = new ApolloServer({
    typeDefs,
    resolvers: allResolvers,
    playground: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res }),
    }),
  );
};

module.exports = useGraphQl;
