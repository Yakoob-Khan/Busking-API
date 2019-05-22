/* eslint-disable consistent-return */
import { Router } from 'express';
import passport from 'passport';

const router = Router();


const { generateToken, sendToken } = require('./utils/token.utils');

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
    console.log('req session in hit route facebook');

    next();
  }, generateToken, sendToken);

module.exports = router;
