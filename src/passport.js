import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
// import User from './models/users';
// const User = require('mongoose').model('User');
import * as UserController from './controllers/user_controller';
import User from './models/users';

// const config = require('./config');
// const passport = require('passport');

// require('./models/users')();
// const passport = require('passport');
// const User = require('mongoose').model('User');
const FacebookTokenStrategy = require('passport-facebook-token');

// module.exports = function exports() {
const FacebookLogin = new FacebookTokenStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: '/auth/facebook/return',
},
((accessToken, refreshToken, profile, done) => {
  console.log('HIT passport facebook auth');
  UserController.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
    // return done(err, Object.assign(user._doc, { accessToken }));
    return done(err, user);
  });
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: 'keyboard cat',
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log('HIT passport jwt auth');
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.id, (err, user) => {
    if (err) {
      done(err, false);
    } else if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(FacebookLogin);

passport.serializeUser((user, done) => {
  console.log('serializing');
  console.log(user._id);
  done(null, user);
});

// Used to decode the received cookie and persist session
// passport.deserializeUser((id, done) => {
//   console.log('deserializing');
//   // // User.findOne({ email }, (err, user) => {
//   // done(null, user);
//   // // });
//   User.findById(id, (err, user) => {
//     console.log('found');
//     done(null, user);
//   });
// });
passport.deserializeUser((user, done) => {
  console.log('Inside deserializeUser callback');
  // console.log(`The user id passport saved in the session file store is: ${id}`);
  done(null, user);
  // const user = users[0].id === id ? users[0] : false;
  // User.findById(id, (err, user) => {
  //   done(null, user);
  // });
});
// };

export function isUserAuthenticated(req, res, next) {
  if (req.user) {
    // done(null, user);
    next();
  } else {
    res.send('You must login!');
  }
}

export const requireAuth = passport.authenticate('jwt', { session: false });

export default passport;
