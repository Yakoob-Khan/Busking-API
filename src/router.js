import { Router } from 'express';
import * as Events from './controllers/event_controller';
// import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to BUSKING API' });
});

router.route('/events')
  .post((req, res) => {
    Events.createEvent(req, res);
  })
  .get((req, res) => {
    Events.getEvents(req, res);
  })
  .delete((req, res) => {
    Events.deleteEvent(req, res);
  });

router.route('/events/:id')
  .get((req, res) => {
    Events.getEvent(req, res);
  })
  .put((req, res) => {
    Events.updateEvent(req, res);
  })
  .delete((req, res) => {
    Events.deleteEvent(req, res);
  });

router.get('/new', (req, res) => {
  res.render('new');
});

// router.post('/new', (req, res) => {
//   const newEvent = {
//     title: req.body.title,
//     imageURL: req.body.imageURL,
//     longitude: req.body.longitude,
//     latitude: req.body.latitude,
//     eventCreator: req.body.eventCreator,
//   };
//   Events.createEvent(newEvent).then((event) => {
//     res.redirect('/');
//   });
// });

router.post('/events/vote/:id', (req, res) => {
  const vote = (req.body.vote === 'up');// convert to bool
  Events.vote(req.params.id, vote).then((result) => {
    res.send(result);
  });
});

export default router;
