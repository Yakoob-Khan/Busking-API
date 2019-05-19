import User from '../models/user';

export const getUsers = (req, res) => {
  return User.find({})
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const getUser = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const signUp = (req, res) => {
  const u = new User();
  u.username = req.body.username;
  u.profilepic_url = req.body.profilepic_url;
  u.email = req.body.email;
  return u.save()
    .then((result) => {
      res.json({ message: 'User created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteUser = (req, res) => {
  // delete a post by the id provided in the route.
  const { id } = req.params;
  return User.findByIdAndDelete(id)
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  return User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const rateUser = (req, res) => {
  const UserId = req.params.id;
  const { rating } = req.body;
  if (rating > 5 || rating < 0) { return res.status(499).json({ error: 'rating not valid' }); }
  return User.findOne({ _id: UserId }).then((user) => {
    user.sumOfRating += parseInt(rating, 10);
    user.numberOfRatings += 1;
    return user.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
