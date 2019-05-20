/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import User from '../models/users';

export const upsertFbUser = (accessToken, refreshToken, profile, cb) => {
  return User.findOne({
    'facebookProvider.id': profile.id,
  }, (err, user) => {
    console.log(user);
    // no user was found, lets create a new one
    if (!user) {
      console.log('not user');
      const newUser = new User({
        fullName: profile.displayName,
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
