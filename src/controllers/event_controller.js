import Event from '../models/event';


export const getEvents = () => {
  // should return a promise that returns a list of events
  return Event.find({});
};

export const createEvent = (event) => {
  // takes in an object with the fields that event should shave
  // and saves them to the database
  // returns a promise
  const e = new Event();
  p.title = event.title;
  p.imageUrl = event.imageUrl;
  p.longitude = event.longitude;
  p.latitude = event.latitude;
  p.eventCreator = event.eventCreator;
  return e.save();
};

export const vote = (eventId, upvote) => {
  // takes in the event id to update and a boolean of whether
  // to update or not.
  // returns a promise
  return Event.findOne({ _id: eventId }).then((event) => {
    console.log(`updating vote: ${event} ${upvote}`);
    if (upvote) {
      event.upvotes += 1;
    } else {
      event.downvotes += 1;
    }
    return event.save();
  });
}