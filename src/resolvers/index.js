import uuidv4 from 'uuid/v4';

export default {
  Query: {
    channels: (_, __, { models }) => Object.values(models.channels)
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
    }
  }
};