const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const blogCommentController = require("../controllers/blogCommentController");

router.get("/all-comments", blogCommentController.getAllComments);

router.use(
  authController.protect,
  authController.restricTO("user", "admin", "employee", "superAdmin")
);

router.post("/create-new-blog-comment", blogCommentController.createComment);
router.get("/user-blog-comments", blogCommentController.userBlogComments);
router.post("/comment-reply", blogCommentController.replyCooment);

module.exports = router;
