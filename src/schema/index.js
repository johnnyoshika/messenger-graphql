import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    channels: [Channel!]
    channel(id: ID!): Channel
  }

  type Mutation {
    addChannel(name: String!): Channel
    addMessage(message: MessageInput!): Message
  }

  type Channel {
    id: ID!
    name: String
    messages: [Message!]!
  }

  type Message {
    id: ID!
    text: String
  }

  input MessageInput {
    channelId: ID!
    text: String!
  }
`;