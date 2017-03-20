const config = {
  twitch: {
    clientId: process.env.CLIENT_ID
  },
  mongo: {
    uri: 'mongodb://localhost:27017/twitch-statics'
  }
};

module.exports = config;
