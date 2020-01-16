import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    channels: [Channel!]
    channel(id: ID!): Channel
  }

  type Mutation {
    addChannel(name: String!): Channel
  }

  type Channel {
    id: ID!
    name: String
  }
`;