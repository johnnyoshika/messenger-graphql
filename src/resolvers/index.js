import { PubSub, withFilter } from 'apollo-server';
import uuidv4 from 'uuid/v4';

const pubSub = new PubSub();

export default {
  Query: {
    channels: (_, __, { models }) => Object.values(models.channels),
    channel: (_, { id }, { models }) => models.channels[id]
  },
  Mutation: {
    addChannel: (root, { name }, { models }) => {
      if (!name)
        throw new Error('name cannot be empty');

      const channel = {
        id: uuidv4(),
        name: name
      };
      models.channels[channel.id] = channel;
      return channel;
    },

    addMessage: (root, { message }, { models }) => {
      const channel = models.channels[message.channelId];
      if (!channel)
        throw new Error('Channel not found');

      if (!message.text)
        throw new Error('text cannot be empty');
      
      const newMessage = {
        id: uuidv4(),
        text: message.text,
        channelId: message.channelId
      };

      models.messages[newMessage.id] = newMessage;

      pubSub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId
      });

      return newMessage;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('messageAdded'),
        (payload, variables) => payload.channelId === variables.channelId
      )
    }
  },

  Channel: {
    messages: (channel, _, { models }) => Object.values(models.messages).filter(
      m => m.channelId === channel.id
    )
  }
};