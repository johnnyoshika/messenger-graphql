import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    channels: [Channel!]
  }

  type Channel {
    id: ID!
    name: String
  }
`;