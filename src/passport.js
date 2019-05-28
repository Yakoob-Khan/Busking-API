import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
import * as UserController from './controllers/user_controller';
import User from './models/users';

const FacebookTokenStrategy = require('passport-facebook-token');

// module.exports = function exports() {
const FacebookLogin = new FacebookTokenStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: '/auth/facebook/return',
},
((accessToken, refreshToken, profile, done) => {
  UserController.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
    // return done(err, Object.assign(user._doc, { accessToken }));
    return done(err, user);
  });
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.authSecret,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
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

passport.deserializeUser((user, done) => {
  console.log('Inside deserializeUser callback');
  done(null, user);
});

export function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('You must login!');
  }
}

export const requireAuth = passport.authenticate('jwt', { session: false });

export default passport;
