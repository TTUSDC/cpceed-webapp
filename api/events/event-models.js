const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const options = {
  timestamps: true,
};

const eventSchema = new Schema({
  creator: String,
  category: String,
  datetime: Date,
  location: String,
  title: String,
  description: String,
}, options);

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
