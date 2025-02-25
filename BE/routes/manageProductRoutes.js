const express = require("express");
const manageProductController = require("../Controller/manageProductController");
const manageProductRouter = express.Router();

manageProductRouter.route("/").get(manageProductController.getAllProduct);

manageProductRouter.route("/:id").get(manageProductController.getProductById);

manageProductRouter.route("/").post(manageProductController.addProduct);

manageProductRouter.route("/:id").put(manageProductController.updateProduct);

manageProductRouter.route("/:id").delete(manageProductController.deleteProduct);

module.exports = manageProductRouter;
