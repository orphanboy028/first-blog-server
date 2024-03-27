const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const { thumblinMidelwear } = require("../utils/multerUploadMiddleware");

router.get("/all-blogs", blogController.getAllBlogs);
router.get("/fllterd-tag-blogs", blogController.getFilteredBlogs);
router.get("/search-query", blogController.getSearchBlogs);
router.get("/single-blog/:slug", blogController.getSingleBlog);
router.post("/update-view-count/:slug", blogController.updateViewCount);

router.get("/tags-blogs/:slug", blogController.blogsByTag);

router.use(
  authController.protect,
  authController.restricTO("user", "admin", "employee", "superAdmin")
);

router.post("/create-blog", blogController.createBlog);
router.post("/blog-create", thumblinMidelwear, blogController.blogCreate);
router.get("/user-blogs", blogController.getUserPublisheBlogs);
router.get("/user-draft-blogs", blogController.getUserDraftBlogs);
router.post("/update-blog-tags/:_id", blogController.updateBlogTag);
router.delete("/delete-blog", blogController.deleteBlog);
router.post("/update-is-active-blog", blogController.updateblogIsActive);
// ADMINS
router.get("/all-admins-blogs", blogController.getAllAdminBlogs);

module.exports = router;
