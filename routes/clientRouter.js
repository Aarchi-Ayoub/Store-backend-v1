const express = require("express");
const clientController = require("./../controllers/clientController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "super_user"),
    clientController.getAllClients
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    clientController.addClient
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    clientController.updateClient
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    clientController.deleteClient
  );

module.exports = router;
