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

  type Subscription {
    messageAdded(channelId: ID!): Message
  }

  type Channel {
    id: ID!
    name: String
    messages: [Message!]!
    messageFeed(after: String): MessageFeed!
  }

  type Message {
    id: ID!
    text: String
  }

  type MessageFeed {
    endCursor: String!
    hasNextPage: Boolean!
    messages: [Message!]!
  }

  input MessageInput {
    channelId: ID!
    text: String!
  }
`;