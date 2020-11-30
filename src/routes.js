const { Router } = require('express');
const UserController = require('./app/controllers/UserController');
const SesssionController = require('./app/controllers/SessionController');
const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();

routes.post('/user', UserController.store);
routes.post('/session', SesssionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

module.exports = routes;
