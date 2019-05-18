import { Router } from 'express';
import * as Events from './controllers/event_controller';
// import { requireAuth, requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to BUSKING API' });
});

router.route('/events')
  .post(Events.createEvent)
  .get(Events.getEvents);
// .get((req, res) => {
//   Events.getEvents(req, res);
// })
// .delete((req, res) => {
//   Events.deleteEvent(req, res);
// });

router.route('/payment')
  .post(Events.payment);

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

router.post('/events/rate/:id', (req, res) => {
  Events.rateEvent(req, res).then((result) => {
    res.send(result);
  });
});

export default router;
