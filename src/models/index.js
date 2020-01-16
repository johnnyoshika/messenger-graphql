let channels = {
  1: {
    id: '1',
    name: 'soccer'
  },
  2: {
    id: '2',
    name: 'basketball'
  },
  3: {
    id: '3',
    name: 'comments'
  }
};

let messages = {
  1: {
    id: '1',
    text: 'Hello world!',
    channelId: '1',
    createdAt: Math.floor(Date.now()) - 100
  },
  2: {
    id: '2',
    text: 'Wonderful day!',
    channelId: '2',
    createdAt: Math.floor(Date.now()) - 90
  }
};

export default {
  channels,
  messages
};