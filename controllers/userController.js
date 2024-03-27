const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

exports.userDetails = catchAsync(async (req, res, next) => {
  const user = await User.findById({ _id: req.user._id });
  res.status(200).json({
    status: "success",
    result: user,
  });
});

exports.updateUserDetails = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    req.body,
    { new: true, runValidators: false }
  );

  res.status(200).json({
    status: "success",
    message: "User details updated successfully",
    user: updatedUser,
  });
});

exports.updateUserName = catchAsync(async (req, res, next) => {
  const { userName } = req.body;

  // Check if the provided userName already exists in the database
  const existingUser = await User.findOne({ userName });

  if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
    return res.status(400).json({
      status: "fail",
      message: "User name is already in use. Please choose a different one.",
    });
  }

  // Proceed with updating the user's details
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      userName: userName,
    },

    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "User details updated successfully",
    user: updatedUser,
  });
});

// Admins
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "succes",
    total: allUsers.length,
    result: allUsers,
  });
});
