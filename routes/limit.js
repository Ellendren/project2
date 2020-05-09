const characterController = new (require('../controllers/CharacterController'))();

const limitRouter = require('koa-router')({
    prefix: '/limit'
});

limitRouter.get('/:character/:limit', characterController.characterLimit);

module.exports = limitRouter;