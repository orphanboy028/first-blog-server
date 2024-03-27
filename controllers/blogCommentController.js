const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Comments = require("../models/blogCommentModel");

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comments.find();

  res.status(200).json({
    status: "Success",
    total: comments.length,
    comments,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { comment, blog } = req.body;
  const newComment = await Comments.create({
    comment,
    blog,
    commentBy: req.user,
  });
  res.status(200).json({
    status: "Success",
    newComment,
  });
});

exports.replyCooment = catchAsync(async (req, res, next) => {
  const { commentId, comment } = req.body;
  const replyBy = req.user;

  const commentToUpdate = await Comments.findById(commentId);

  if (!commentToUpdate) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Add the new reply to the comment
  commentToUpdate.replies.push({ comment, replyBy });

  // Save the updated comment
  await commentToUpdate.save();

  res.status(200).json({
    status: "Success",
    commentToUpdate,
  });
});

exports.userBlogComments = catchAsync(async (req, res, next) => {
  const userId = req.user;

  const comments = await Comments.find({ commentBy: userId }).populate({
    path: "blog",
    select: "title",
  });

  res.status(200).json({
    status: "Success",
    comments,
  });
});
