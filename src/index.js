import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models
  }
});

server.applyMiddleware({ app, path: '/graphql' });

// subscription setup: robinwieruch.de/graphql-apollo-server-tutorial#apollo-server-subscription-setup

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});