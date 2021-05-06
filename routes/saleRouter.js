const express = require("express");
const saleController = require("./../controllers/saleController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, saleController.getAllSales)
  .post(authController.protect, saleController.addSale);

router
  .route("/:id")
  .patch(authController.protect, saleController.updateSale)
  .delete(authController.protect, saleController.deleteSale);

module.exports = router;
