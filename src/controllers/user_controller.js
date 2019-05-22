/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import User from '../models/users';

export const upsertFbUser = (accessToken, refreshToken, profile, cb) => {
  return User.findOne({
    'facebookProvider.id': profile.id,
  }, (err, user) => {
    console.log('hit upsertFbuser in controller');
    // console.log(user);
    // console.log(profile);
    // no user was found, lets create a new one
    if (!user) {
      console.log('not user');
      const newUser = new User({
        photo: profile.photos[0].value,
        name: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken,
        },
      });

      newUser.save((error, savedUser) => {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      console.log('yes user');
      return cb(err, user);
    }
  });
};
// =======

// export const getUsers = (req, res) => {
//   return User.find({})
//     .then((result) => {
//       res.json(result);
//     }).catch((error) => {
//       res.status(500).json({ error });
//     });
// };

// export const getUser = (req, res) => {
//   const { id } = req.params;
//   return User.findById(id)
//     .then((result) => {
//       res.json(result);
//     }).catch((error) => {
//       res.status(500).json({ error });
//     });
// };

// export const signUp = (req, res) => {
//   const u = new User();
//   u.username = req.body.username;
//   u.profilepic_url = req.body.profilepic_url;
//   u.email = req.body.email;
//   return u.save()
//     .then((result) => {
//       res.json({ message: 'User created!' });
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// };

// export const deleteUser = (req, res) => {
//   // delete a post by the id provided in the route.
//   const { id } = req.params;
//   return User.findByIdAndDelete(id)
//     .then((result) => {
//       res.json(result);
//     }).catch((error) => {
//       res.status(500).json({ error });
//     });
// };

// export const updateUser = (req, res) => {
//   const { id } = req.params;
//   return User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
//     .then((result) => {
//       res.json(result);
//     }).catch((error) => {
//       res.status(500).json({ error });
//     });
// };

// export const rateUser = (req, res) => {
//   const UserId = req.params.id;
//   const { rating } = req.body;
//   if (rating > 5 || rating < 0) { return res.status(499).json({ error: 'rating not valid' }); }
//   return User.findOne({ _id: UserId }).then((user) => {
//     user.sumOfRating += parseInt(rating, 10);
//     user.numberOfRatings += 1;
//     return user.save();
//   }).catch((error) => {
//     res.status(500).json({ error });
//   });
// };
