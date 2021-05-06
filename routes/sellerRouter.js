const express = require("express");
const sellerController = require("./../controllers/sellerController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "super_user"),
    sellerController.getAllSellers
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    sellerController.addSeller
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    sellerController.updateSeller
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    sellerController.deleteSeller
  );

module.exports = router;
