export default {
  Query: {
    channels: (_, __, { models }) => Object.values(models.channels)
  }
};