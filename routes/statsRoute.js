const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");
const statsConroller = require("../controllers/statsConroller");

// router.use(
//   authController.protect,
//   authController.restricTO("user", "admin", "employee", "superAdmin")
// );

router.get("/blog-stats", statsConroller.getBlogStats);
router.get("/user-blog-stats", statsConroller.calculateRankPosition);

module.exports = router;
