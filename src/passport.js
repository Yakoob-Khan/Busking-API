'use strict';

// const config = require('./config');
import passport from 'passport';
import config from './config';
// import User from './models/users';
// const User = require('mongoose').model('User');
import * as UserController from './controllers/user_controller';

// require('./models/users')();
// const passport = require('passport');
// const User = require('mongoose').model('User');
const FacebookTokenStrategy = require('passport-facebook-token');

module.exports = function exports() {
  passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
  },
  ((accessToken, refreshToken, profile, done) => {
    UserController.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
      return done(err, user);
    });
  })));
};
