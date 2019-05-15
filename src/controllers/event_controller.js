import Event from '../models/event';


export const getEvents = (req, res) => {
  // should return a promise that returns a list of events
  return Event.find({})
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const getEvent = (req, res) => {
  const { id } = req.params;
  return Event.findById(id)
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const createEvent = (req, res) => {
  // takes in an object with the fields that event should shave
  // and saves them to the database
  // returns a promise
  const e = new Event();
  e.title = req.body.title;
  e.imageURL = req.body.imageURL;
  e.longitude = req.body.longitude;
  e.latitude = req.body.latitude;
  e.eventCreator = req.body.eventCreator;
  // e.eventCreator = req.user.userName; ?? How do we do this without passport
  return e.save()
    .then((result) => {
      res.json({ message: 'event created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteEvent = (req, res) => {
  // delete a post by the id provided in the route.
  const { id } = req.params;
  return Event.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const updateEvent = (req, res) => {
  const { id } = req.params;
  return Event.findByIdAndUpdate(id, { $set: req.body })
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const rateEvent = (req, res) => {
  const eventId = req.params.id;
  const { rating } = req.body;
  if (rating > 5 || rating < 0) { return res.status(499).json({ error: 'rating not valid' }); }
  return Event.findOne({ _id: eventId }).then((event) => {
    console.log(`updating vote: ${event} ${rating}`);
    event.averageRating = (event.averageRating * event.numberOfRatings + rating) / (event.numberOfRatings + 1);
    event.numberOfRatings += 1;
    return event.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
