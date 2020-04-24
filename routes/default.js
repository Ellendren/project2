const dataCenterRouter = require('./datacenter');
const serverRouter = require('./server');
const defaultRouter = require('koa-router')({
    prefix: '/api'
});

defaultRouter.get('/', ctx => {
    ctx.status = 200;
    ctx.body = "Default Route Found!";
});

defaultRouter.use(
    dataCenterRouter.routes(),
    serverRouter.routes()
);

module.exports = api => {
    api.use(defaultRouter.routes());
};