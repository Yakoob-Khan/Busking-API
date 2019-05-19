import { Router } from 'express';
import * as Events from './controllers/event_controller';
import * as Users from './controllers/user_controller';
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

router.route('/users')
  .get((req, res) => {
    Users.getUsers(req, res);
  })
  .post((req, res) => {
    Users.signUp(req, res);
  })
  .delete((req, res) => {
    Users.deleteEvent(req, res);
  });

router.route('/users/:id')
  .get((req, res) => {
    Users.getUser(req, res);
  })
  .put((req, res) => {
    Users.updateUser(req, res);
  })
  .delete((req, res) => {
    Users.deleteUser(req, res);
  });

router.post('/events/rate/:id', (req, res) => {
  Events.rateEvent(req, res).then((result) => {
    res.send(result);
  });
});

export default router;
