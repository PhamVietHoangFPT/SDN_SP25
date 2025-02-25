const express = require('express')
const accountController = require('../Controller/accountController.js')
const accountRouter = express.Router()

accountRouter.route('/')
  .get(accountController.getAllAccount)

accountRouter.route('/:accountID')
  .delete(accountController.deleteAccount)
module.exports = accountRouter;