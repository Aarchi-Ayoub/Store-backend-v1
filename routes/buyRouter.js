const express = require("express");
const buyController = require("./../controllers/buyController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "super_user"),
    buyController.getAllBuysProducts
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    authController.restrictTo("admin"),
    buyController.addBuyProduct
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    buyController.updateBuyProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    buyController.deleteBuyProduct
  );

module.exports = router;
