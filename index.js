const axios = require('axios');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const _ = require('lodash');
const CronJob = require('cron').CronJob;

const config = require('./config');
const {
  Entry: EntryModel
} = require('./schemas');

const streams = require('./streams.json');

if (!config.twitch.clientId) {
  console.error('NO CLIENT_ID SPECIFIED');
  process.exit(1);
}

axios.defaults.headers.common['Client-ID'] = config.twitch.clientId;

function getStreamData(channel) {
  return new Promise((resolve) => {
    axios({
      url: `https://api.twitch.tv/kraken/streams/${channel}`,
      method: 'GET'
    }).then(({data}) => {
      if (data.stream) {
        resolve({channel, viewers: data.stream.viewers});
      } else {
        resolve(null);
      }
    }).catch((error) => {
      resolve(null);
      console.error('CHANNEL', channel);
      console.error(error);
    });
  });
}

function getStreamsInfo() {
  const createdAt = new Date(Date.now());
  createdAt.setSeconds(0);
  createdAt.setMilliseconds(0);
  Promise.all(streams.map((chan) => getStreamData(chan)))
    .then((entries) => _.filter(entries, (entry) => entry !== null))
    .then((entries) => entries.map((entry) => _.assign({}, entry, {createdAt})))
    .tap(console.log)
    .then((entries) => EntryModel.collection.insert(entries));
}

const job = new CronJob('0 * * * * *', getStreamsInfo);

mongoose.connection.once('connected', () => {
  console.log('[mongoose]: Connected');
  job.start();
});

mongoose.connection.once('error', (err) => {
  console.log('[mongoose] Error: ', err);
  throw err;
});

mongoose.connection.once('disconnected', () => {
  console.log('[mongoose] Disconnected');
});

mongoose.connect(config.mongo.uri);
