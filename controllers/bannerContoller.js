const SideBanner = require("../models/sideBannerModel");
const Factory = require("../utils/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// List of tags
const tagList = ["javascript", "css", "html"];

exports.createBanner = catchAsync((req, res, next) => {});

exports.SideBanner = catchAsync(async (req, res, next) => {
  const { tag } = req.body;

  if (!tagList.includes(tag)) {
    return next(new AppError("tagName must be an array"));
  }
  const banner = await SideBanner.find({ tags: tag });

  res.status(200).json({
    status: "success",
    result: banner,
  });
});
