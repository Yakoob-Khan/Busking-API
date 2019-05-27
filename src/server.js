import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRouter from './router';
import authRouter from './auth_routes';
import passport, { requireAuth } from './passport';


// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/busking';
// Credit to remove deprecated warning:
// https://stackoverflow.com/questions/50448272/avoid-current-url-string-parser-is-deprecated-warning-by-setting-usenewurlpars
mongoose.connect(mongoURI, { useNewUrlParser: true });
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();
app.use(cookieParser());

// enable/disable cross origin resource sharing if necessary
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
  allowedHeaders: 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept, authorization',
};
app.use(cors(corsOption));

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
// app.use(passport.session());


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// this should go AFTER body parser
app.use('/api', apiRouter);
app.use('/auth', authRouter);
// additional init stuff should go before hitting the routing

// default index route
app.get('/', requireAuth, (req, res) => {
  if (req.user) {
    console.log(req.user);
    res.send(req.user);
  } else {
    console.log('no req user saved');
    res.send('no req user saved');
  }
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
