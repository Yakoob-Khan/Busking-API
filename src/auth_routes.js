/* eslint-disable consistent-return */
import { Router } from 'express';
import passport from 'passport';
import { requireAuth } from './passport';

const router = Router();


const { generateToken, sendToken } = require('./utils/token.utils');

router.route('/facebook')
  .post(passport.authenticate('facebook-token', { session: true }), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id,
    };

    next();
  }, generateToken, sendToken);

router.get('/facebook/refresh', requireAuth, (req, res) => {
  return res.status(200).send(JSON.stringify(req.user));
});

module.exports = router;
