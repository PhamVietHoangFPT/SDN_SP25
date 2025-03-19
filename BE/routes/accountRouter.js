const express = require('express')
const accountController = require('../Controller/accountController.js')
const accountRouter = express.Router()

const checkRole = require("../middlewares/authMiddleware");
const manager = require("../constant/constant").manager;

accountRouter.route('/')
  .get(accountController.getAllAccount)

accountRouter.route('/:id')
  .get(accountController.getAccountById)
  .put(accountController.updateAccount)
  .delete(checkRole(manager), accountController.deleteAccount)
module.exports = accountRouter;