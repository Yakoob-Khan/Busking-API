import jwt from 'jsonwebtoken';
// import config from '../config';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const createToken = function createToken(auth) {
  return jwt.sign({
    id: auth.id,
  }, process.env.authSecretJWT,
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
