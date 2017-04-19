const eventModels = require('./event-models');

const Event = eventModels.Event;


const createEvent = (reqData, locals, createCallback) => {
  const event = new Event({
    creator: reqData.creator,
    category: reqData.category,
    datetime: reqData.datetime,
    location: reqData.location,
    title: reqData.title,
    description: reqData.description,
  });
  event.save(createCallback);
};


module.exports = { createEvent };
