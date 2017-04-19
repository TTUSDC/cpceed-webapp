const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  creator: String,
  category: String,
  datetime: Date,
  location: String,
  title: String,
  description: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
