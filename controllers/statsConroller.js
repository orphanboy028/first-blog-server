const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Blogs = require("../models/blogModel");
const Tags = require("../models/blogTagModel");
const mongoose = require("mongoose");

// Admin
exports.getBlogStats = async (req, res) => {
  try {
    const blogStats = await Blogs.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalBlog: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      blogStats,
    });
  } catch (error) {
    res.status(400).json({
      status: "success",
      result: error,
    });
  }
};

exports.calculateRankPosition = async (req, res) => {
  try {
    // Step 1: Calculate total number of blogs per user
    const userBlogCounts = await Blogs.aggregate([
      {
        $group: {
          _id: "$posteBy",
          totalBlogs: { $sum: 1 },
        },
      },
    ]);

    console.log("User blog counts:", userBlogCounts);

    // Step 2: Calculate rank position for each blog
    for (const userBlogCount of userBlogCounts) {
      const userId = userBlogCount._id;
      const totalBlogs = userBlogCount.totalBlogs;
      console.log("User ID:", userId);
      const userBlogs = await Blogs.find({ posteBy: userId });
      console.log("User blogs:", userBlogs);
      for (const blog of userBlogs) {
        const rankPosition = totalBlogs * blog.viewCount;
        blog.rankPosition = rankPosition;
        await blog.save();
      }
    }

    // Send success response
    res.status(200).json({
      status: "success",
      message: "Rank positions updated successfully.",
    });
  } catch (error) {
    console.error("Error updating rank positions:", error);

    // Send error response
    res
      .status(500)
      .json({ status: "error", message: "Failed to update rank positions." });
  }
};
