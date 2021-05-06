const express = require("express");
const stockController = require("./../controllers/stockController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "super_user"),
    stockController.getAllStock
  );

module.exports = router;
