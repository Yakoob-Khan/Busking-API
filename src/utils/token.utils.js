import jwt from 'jsonwebtoken';
import config from '../config';

const createToken = function createToken(auth) {
  return jwt.sign({
    id: auth.id,
  }, config.authSecret,
  {
    expiresIn: 10 * 60 * 1000,
  });
};

module.exports = {
  generateToken(req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken(req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  },
};
