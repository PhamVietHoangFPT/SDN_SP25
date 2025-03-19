const express = require('express')
const accountController = require('../Controller/accountController.js')
const accountRouter = express.Router()

const checkRole = require("../middlewares/authMiddleware");
const manager = require("../constant/constant").manager;

accountRouter.route('/')
  .get(checkRole(manager), accountController.getAllAccount)
  .post(accountController.addAccount)

accountRouter.route('/:id')
  .get(checkRole(manager), accountController.getAccountById)
  .put(checkRole(manager), accountController.updateAccount)
  .delete(checkRole(manager), accountController.deleteAccount)
module.exports = accountRouter;