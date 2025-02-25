const express = require("express");
const manageProductController = require("../Controller/manageProductController");
const manageProductRouter = express.Router();
const { checkRole } = require("../middlewares/authMiddleware");

manageProductRouter
  .route("/", checkRole("Admin"))
  .get(manageProductController.getAllProduct);

manageProductRouter
  .route("/:id", checkRole("Admin"))
  .get(manageProductController.getProductById);

manageProductRouter
  .route("/", checkRole("Admin"))
  .post(manageProductController.addProduct);

manageProductRouter
  .route("/:id", checkRole("Admin"))
  .put(manageProductController.updateProduct);

manageProductRouter
  .route("/:id", checkRole("Admin"))
  .delete(manageProductController.deleteProduct);

module.exports = manageProductRouter;
