const config = {
  twitch: {
    clientId: process.env.CLIENT_ID
  },
  mongo: {
    uri: 'mongodb://192.168.1.59:27017/twitch-statics'
  }
};

module.exports = config;
