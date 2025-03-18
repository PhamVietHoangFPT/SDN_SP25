const express = require("express");
const categoryController = require('../Controller/CategoryController')

const categoryRouter = express.Router();

const checkRole = require("../middlewares/authMiddleware");
const manager = require("../constant/constant").manager;

categoryRouter.route('/')
    .get(checkRole(manager), categoryController.getAllCategory)
    .post(checkRole(manager), categoryController.addCategory)
categoryRouter.route('/:id')
    .get(checkRole(manager), categoryController.getCategoryById)
    .put(checkRole(manager), categoryController.updateCategory)
    .delete(checkRole(manager), categoryController.deleteCategory)
module.exports = categoryRouter;