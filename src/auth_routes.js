/* eslint-disable consistent-return */
import { Router } from 'express';
// const router = express.Router();
// const passport = require('passport');
import passport from 'passport';

// const express = require('express');

// const cookieParser = require('cookie-parser');

// const cookie = require('cookie-signature');
// const session = require('express-session');

const router = Router();
// router.use(cookieParser());
// router.use(session({
//   secret: 'keyboard cat', resave: false, saveUninitialized: true,
// }));
// router.use(passport.initialize());
// router.use(passport.session());


const { generateToken, sendToken } = require('./utils/token.utils');
// const config = require('./config');
// const request = require('request');
// require('./passport')();

router.route('/facebook')
  .post(passport.authenticate('facebook-token', { session: true }), (req, res, next) => {
    console.log('HIT /auth/facebook');
    console.log(req.user);
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id,
    };
    // const { user } = req;
    // req.login(user, (err) => {
    //   console.log('Inside req.login() callback');
    //   console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
    //   console.log(`req.user: ${JSON.stringify(req.user)}`);
    //   // return res.send('You were authenticated & logged in!\n');
    // });
    // req.user = req.user;
    // req.user.save();
    console.log('req session in hit route facebook');
    console.log(req.user);
    // req.session.save();
    console.log(req.session);

    next();
  }, generateToken, sendToken);

// router.post(
//   '/facebook',
//   (req, res, next) => {
//     passport.authenticate('facebook-token', (error, user, info) => {
//       if (error || !user) {
//         return res.status(401).json({
//           error,
//           info,
//         });
//       }

//       if (req.sessionID && user) {
//         console.log('req session id hit');
//         req.login(user, () => {
//           // console.log(req.sessionID);
//           // console.log(info);
//           console.log(user);
//           res.setHeader('x-auth-token', user.accessToken);
//           return res.json({
//             sessionID: cookie.sign(req.sessionID, 'keyboard cat'),
//             profile: user,
//           });
//         });
//       }

//       next();
//     })(req, res, next);
//   },
// );

// router.get('/facebook/return',
//   passport.authenticate('facebook-token', { failureRedirect: '/login' }),
//   (req, res) => {
//     console.log('hit cb');
//     res.redirect('/');
//   });

// router.get('/sessionTest', requireAuth, (req, res, next) => {
//   console.log('session test');
//   console.log(req.session);
//   res.send(req.session);
//   // console.log(req.user);
// });

module.exports = router;
