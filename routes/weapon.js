const weaponController = new (require('../controllers/WeaponController'))();

const  weaponRouter = require('koa-router')({
    prefix: '/weapon'
});

weaponRouter.get('/', weaponController.weapons);
weaponRouter.get('/:weapon', weaponController.weapon);
weaponRouter.post('/', weaponController.addWeapon, weaponController.weapons);
weaponRouter.put('/:weapon', weaponController.updateWeapon, weaponController.weapon);
weaponRouter.delete('/:weapon', weaponController.deleteWeapon, weaponController.weapons);

module.exports = weaponRouter;