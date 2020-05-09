const characterRouter = require('./character');
const testRouter = require('./test');
const weaponRouter = require('./weapon');
const skillRouter = require('./skill');
const attributeRouter = require('./attribute');
const limtRouter = require('./limit');
const defaultRouter = require('koa-router')({
    prefix: '/api'
});

defaultRouter.get('/', ctx => {
    ctx.status = 200;
    ctx.body = "Default Route Found!";
});

defaultRouter.use(
    characterRouter.routes(),
    testRouter.routes(),
    weaponRouter.routes(),
    skillRouter.routes(),
    attributeRouter.routes(),
    limtRouter.routes()
);

module.exports = api => {
    api.use(defaultRouter.routes());
};
