const mongoose = require('mongoose');

const EntrySchema = mongoose.Schema({
  channel: String,
  viewers: Number,
  createdAt: Date
}, { versionKey: false });

const modelName = 'Entry';
module.exports = mongoose.models[modelName] || mongoose.model(modelName, EntrySchema);
