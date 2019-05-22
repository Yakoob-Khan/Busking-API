import Event from '../models/event';

const stripe = require('stripe')('sk_test_Rs7JmI7NwuDFF7sSeHxStydx00MFE4aWqy');

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
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    imageURL: req.body.imageURL,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    eventCreator: req.user.name,
  });
  return event.save()
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
    event.sumOfRating += parseInt(rating, 10);
    event.numberOfRatings += 1;
    return event.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

export const payment = (req, res) => {
  console.log(req.body);
  return stripe.charges
    .create({
      amount: req.body.amount, // Unit: cents
      currency: 'USD',
      source: req.body.source,
      description: req.body.description,
    })
    .then((result) => { return res.status(200).json(result); });
};
