/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const passport = require('passport');
const { generateToken, sendToken } = require('./utils/token.utils');
// const config = require('./config');
// const request = require('request');
require('./passport')();

router.route('/facebook')
  .post(passport.authenticate('facebook-token', { session: false }), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id,
    };

    next();
  }, generateToken, sendToken);


module.exports = router;
