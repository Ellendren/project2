const serverController = new (require('../controllers/ServerController'))();

const serverRouter = require('koa-router')({
    prefix: '/server'
});

serverRouter.get('/', serverController.servers);
serverRouter.get('/:server', serverController.server);
serverRouter.post('/', serverController.addServer, serverController.servers);
serverRouter.put('/:server', serverController.updateServer, serverController.server);
serverRouter.delete('/:server', serverController.deleteServer, serverController.servers);

module.exports = serverRouter;