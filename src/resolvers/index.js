import { PubSub, withFilter } from 'apollo-server';
import uuidv4 from 'uuid/v4';

const pubSub = new PubSub();

const mapCommentToMessage = c => ({
  id: `c${c.id}`,
  text: c.body,
  channelId: '3'
}); 

const mapMessagesToMessageFeed = (messages, limit, cursorProperty) => ({
  messages: messages.slice(0, limit),
  endCursor: messages.length
    ? messages.slice(0, limit).slice(-1)[0][cursorProperty]
    : '',
  hasNextPage: messages.length > limit
});


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
        channelId: message.channelId,
        createdAt: Math.floor(Date.now())
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
    messages: (channel, _, { models, dataSources }) => channel.id === '3'
      ? dataSources.jsonplaceholder.getComments().then(comments => comments
        .sort((a, b) => b.id - a.id)
        .map(mapCommentToMessage)
      )
      : Object.values(models.messages).filter(
          m => m.channelId === channel.id
        ).sort((a, b) => b.createdAt - a.createdAt),
    
    messageFeed: (channel, { after }, { models, dataSources }) => {
      const limit = 10;
      if (channel.id === '3') {
        const commentAfter = (after || '').match(/\d+/);
        return dataSources.jsonplaceholder.getComments().then(comments => 
          mapMessagesToMessageFeed(
            comments
              .filter(c => commentAfter === null || c.id < parseInt(commentAfter[0], 10))
              .sort((a, b) => b.id - a.id)
              .map(mapCommentToMessage),
            limit,
            'id'
          )
        );
      } else {
        const messageAfter = parseInt(after);
        return mapMessagesToMessageFeed(
          Object.values(models.messages)
            .filter(m => m.channelId === channel.id)
            .filter(m => isNaN(messageAfter) || m.createdAt < messageAfter)
            .sort((a, b) => b.createdAt - a.createdAt),
          limit,
          'createdAt'
        );
      }
    }
  }
};