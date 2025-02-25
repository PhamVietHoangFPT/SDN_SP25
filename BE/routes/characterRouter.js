const express = require('express');
const characterController = require('../Controller/characterController.js');
const characterRouter = express.Router();

characterRouter.route('/')
  .get(characterController.getAll)
  .post(characterController.addCharacter)

characterRouter.route('/:characterID')
  .put(characterController.updateCharacter)
  .delete(characterController.deleteCharacter)
  .get(characterController.getCharacterById)
module.exports = characterRouter;