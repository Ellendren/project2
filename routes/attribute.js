const attributeController = new (require('../controllers/AttributeController'))();

const attributeRouter = require('koa-router')({
    prefix: '/attribute'
});


attributeRouter.get('/', attributeController.attributes);
attributeRouter.get('/:name/:attribute', attributeController.attribute);
attributeRouter.post('/', attributeController.addAttribute, attributeController.attributes);
attributeRouter.put('/:name/:attribute', attributeController.updateAttribute, attributeController.attribute);
attributeRouter.delete('/:name/:attribute', attributeController.deleteAttribute, attributeController.attributes);


module.exports = attributeRouter;