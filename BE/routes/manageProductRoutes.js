const express = require("express");
const { checkRole } = require("../middlewares/authMiddleware");
const manageProductController = require("../Controller/manageProductController");

const manageProductRouter = express.Router();

manageProductRouter
  .route("/")
  .get(checkRole("Manager"), manageProductController.getAllProduct)
  .post(checkRole("Manager"), manageProductController.addProduct);

manageProductRouter
  .route("/:id")
  .put(checkRole("Manager"), manageProductController.updateProduct)
  .delete(checkRole("Manager"), manageProductController.deleteProduct);

module.exports = manageProductRouter;
