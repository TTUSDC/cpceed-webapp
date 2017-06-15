const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const options = {
  timestamps: true,
};

/**
 * Event Object
 * @typedef {Object} EventSchema
 * @param {string} creator - UID of event creator
 * @param {string} category - Category of the event
 * @param {Date} datetime - Date & time of the event
 * @param {string} location - Location of event
 * @param {string} title - Title of the event
 * @param {string} description - Description of the event
 */
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
