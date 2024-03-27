const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

router.get("/all-tags", tagController.getAllTags);

router.use(
  authController.protect,
  authController.restricTO("user", "admin", "employee", "superAdmin")
);

router.post("/create-new-tag", tagController.createTag);
router.post("/create-users-tag", tagController.tagByUsers);
router.delete("/delete-tag", tagController.deleteTags);

module.exports = router;
