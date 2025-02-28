const express = require("express");
const { checkRole } = require("../middlewares/authMiddleware");
const manageProductController = require("../Controller/manageProductController");

const manageProductRouter = express.Router();

const checkRole = require("../middlewares/authMiddleware");
const manager = require("../constant/constant").manager

manageProductRouter
  .route("/")
  .get(checkRole(manager), manageProductController.getAllProduct)
  .post(checkRole(manager), manageProductController.addProduct)
  
manageProductRouter
  .route("/:id")
  .get(checkRole(manager), manageProductController.getProductById)
  .put(checkRole(manager), manageProductController.updateProduct)
  .delete(checkRole(manager), manageProductController.deleteProduct)

module.exports = manageProductRouter;
