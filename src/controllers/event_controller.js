/* eslint-disable camelcase */
import axios from 'axios';
import Event from '../models/event';
import User from '../models/users';

const stripe_secret_key = 'sk_test_Rs7JmI7NwuDFF7sSeHxStydx00MFE4aWqy';
const stripe = require('stripe')(stripe_secret_key);

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
  // <<<<<<< HEAD
  return Event.findById(id).populate({
    path: 'comments',
    model: 'Comment',
    populate: { path: 'author', model: 'User' },
  }).populate({ path: 'attendees' })
  // =======
  //   return Event.findById(id).populate('attendees')
  // >>>>>>> origin/master
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((error) => {
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
    address: req.body.address,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    // eventCreator: req.user.name,
    // eventCreatorPhoto: req.user.photo,
    host: req.user.id,
    stripeId: req.body.stripeId,
  });
  User.findById(req.user.id, (err, user) => {
    user.eventsHosted.push(event);
    user.save();
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
  return Event.findOne({ _id: eventId }).then((event) => {
    event.sumOfRating += parseInt(rating, 10);
    event.numberOfRatings += 1;
    return event.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

export const attendEvent = (req, res) => {
  const { id } = req.params;
  User.findById(req.user.id, (err, user) => {
    user.eventsAttended.push(id);
    user.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
  Event.findByIdAndUpdate(id, { $push: { attendees: req.user.id } }, { new: true }).populate('attendees')
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const leaveEvent = (req, res) => {
  const { id } = req.params;
  User.findById(req.user.id, (err, user) => {
    user.eventsAttended.pull(id);
    user.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
  Event.findByIdAndUpdate(id, { $pull: { attendees: req.user.id } }, { new: true }).populate('attendees')
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const payment = (req, res) => {
  return stripe.charges
    .create({
      amount: req.body.amount, // Unit: cents
      currency: 'USD',
      source: req.body.source,
      description: req.body.description,
    }, {
      stripe_account: req.body.stripeId,
    })
    .then((result) => { return res.status(200).json(result); });
};


export const stripeAccount = (req, res) => {
  return axios.post('https://connect.stripe.com/oauth/token',
    {
      client_secret: stripe_secret_key,
      code: req.body.code,
      grant_type: 'authorization_code',
    })
    .then((result) => {
      return res.send(result.data);
    })
    .catch((error) => {
      // res.status(500).json('error');
      console.log(error.response);
    });
};
