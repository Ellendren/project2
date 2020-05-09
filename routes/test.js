const testController = new (require('../controllers/TestController'))();

const testRouter = require('koa-router')({
    prefix: '/test'
});

testRouter.get('/', testController.tests);
testRouter.get('/:test', testController.test);
testRouter.post('/', testController.addTest, testController.tests);
testRouter.put('/:test', testController.updateTest, testController.test);
testRouter.delete('/:test', testController.deleteTest, testController.tests);

module.exports = testRouter;