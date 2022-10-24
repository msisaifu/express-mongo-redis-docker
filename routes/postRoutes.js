const express = require("express");
const router = express.Router();
const protect = require("./../middleware/checkAuth");
const postController = require("./../controllers/postController");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:id")
  .get(postController.getPostByID)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
