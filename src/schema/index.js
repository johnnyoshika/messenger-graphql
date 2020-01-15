import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    me: User
  }

  type User {
    id: ID!
    username: String!
  }
`;