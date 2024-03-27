const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.use(
  authController.protect,
  authController.restricTO("user", "admin", "superAdmin")
);
router.get("/user-detail", userController.userDetails);
router.patch("/update-user", userController.updateUserDetails);
router.post("/update-password", authController.updatePassword);
router.post("/update-user-name", userController.updateUserName);
router.get("/all-users", userController.getAllUsers);

module.exports = router;
