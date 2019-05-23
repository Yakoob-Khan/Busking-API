import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import config from './config';
import dotenv from 'dotenv';
import * as UserController from './controllers/user_controller';
import User from './models/users';

dotenv.config({ silent: true });

const FacebookTokenStrategy = require('passport-facebook-token');

// module.exports = function exports() {
const FacebookLogin = new FacebookTokenStrategy({
  clientID: process.env.facebookAuthClientID,
  clientSecret: process.env.facebookAuthClientSecret,
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
  secretOrKey: process.env.authSecretJWT,
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
