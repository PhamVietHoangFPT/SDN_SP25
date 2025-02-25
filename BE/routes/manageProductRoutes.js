const express = require("express");
const manageProductController = require("../Controller/manageProductController");
const manageProductRouter = express.Router();

const checkRole = require("../middlewares/authMiddleware");

manageProductRouter
  .route("/", checkRole("Manage"))
  .get(manageProductController.getAllProduct);

manageProductRouter
  .route("/:id", checkRole("Manage"))
  .get(manageProductController.getProductById);

manageProductRouter
  .route("/", checkRole("Manage"))
  .post(manageProductController.addProduct);

manageProductRouter
  .route("/:id", checkRole("Manage"))
  .put(manageProductController.updateProduct);

manageProductRouter
  .route("/:id", checkRole("Manage"))
  .delete(manageProductController.deleteProduct);

module.exports = manageProductRouter;
