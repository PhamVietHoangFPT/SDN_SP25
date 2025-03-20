const express = require("express");
const router = express.Router();
const accountControllers = require("../Controller/profileController");

const checkRole = require("../middlewares/authMiddleware");
const { customer } = require("../constant/constant").customer;

router.route("/", checkRole(customer)).get(accountControllers.getProfile);
router
  .route("/editProfile", checkRole(customer))
  .put(accountControllers.editProfile);
router
  .route("/changePassword", checkRole(customer))
  .put(accountControllers.editPassword);
module.exports = router;
