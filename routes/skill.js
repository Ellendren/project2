const skillController = new (require('../controllers/SkillController'))();

const skillRouter = require('koa-router')({
    prefix: '/skill'
});


skillRouter.get('/', skillController.skills);
skillRouter.get('/:name/:skill', skillController.skill);
skillRouter.post('/', skillController.addSkill, skillController.skills);
skillRouter.put('/:name/:skill', skillController.updateSkill, skillController.skill);
skillRouter.delete('/:name/:skill', skillController.deleteSkill, skillController.skills);


module.exports = skillRouter;