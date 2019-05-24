/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import Comment from '../models/comment';

// export const createComment = (req, res) => {
//   // should return a promise that returns a list of events
//   return Event.find({})
//     .then((result) => {
//       res.json(result);
//     }).catch((error) => {
//       res.status(500).json({ error });
//     });
// };

export const writeComment = (req, res) => {
  // takes in an object with the fields that event should shave
  // and saves them to the database
  // returns a promise
  const { eventId } = req.params;
  const comment = new Comment({
    text: req.body.text,
    author: req.user.id,
  });
  return Event.findById(eventId, (err, event) => {
    event.comments.push(comment);
    event.save()
      .then((result) => {
        res.json({ message: 'comment written!' });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });

  //   User.findById(req.user.id, (err, user) => {
  //     user.eventsHosted.push(event);
  //     user.save();
  //   });
};
