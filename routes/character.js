const characterController = new (require('../controllers/CharacterController'))();

const characterRouter = require('koa-router')({
    prefix: '/character'
});

characterRouter.get('/', characterController.characters);
characterRouter.get('/:character', characterController.character);
characterRouter.post('/', characterController.addCharacter, characterController.characters);
characterRouter.put('/:character', characterController.updateCharacter, characterController.characters);
characterRouter.delete('/:character', characterController.deleteCharacter, characterController.characters);
characterRouter.get('/:character/:test', characterController.characterTest);

module.exports = characterRouter;