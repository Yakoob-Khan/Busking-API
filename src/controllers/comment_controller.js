/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import Comment from '../models/comment';
import Event from '../models/event';


export const writeComment = (req, res) => {
  const { id } = req.params;
  const comment = new Comment({
    text: req.body.text,
    author: req.user.id,
  });
  comment.save();
  return Event.findById(id, (err, event) => {
    event.comments.push(comment);
    event.save()
      .then((result) => {
        res.json(JSON.stringify(event));
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
};
