const Tags = require("../models/blogTagModel");
const Factory = require("../utils/handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createTag = catchAsync(async (req, res, next) => {
  const { tagName } = req.body;
  const newTag = await Tags.create({
    tagName,
    tagBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    result: newTag,
  });
});

exports.getAllTags = catchAsync(async (req, res, next) => {
  const allTags = await Tags.find();

  res.status(200).json({
    status: "success",
    total: allTags.length,
    result: allTags,
  });
});

exports.deleteTags = catchAsync(async (req, res, next) => {
  const { _id } = req.body;

  const doc = await Tags.findByIdAndDelete(_id);

  res.status(200).json({
    status: "success",
    result: doc,
  });
});

exports.tagByUsers = catchAsync(async (req, res, next) => {
  const { tags } = req.body;
  console.log(tags);

  // Filter out existing tags
  const existingTags = await Tags.find({ tagName: { $in: tags } });
  const existingTagNames = existingTags.map((tag) => tag.tagName);
  const newTags = tags.filter((tag) => !existingTagNames.includes(tag));

  // Create new tags
  const createdTags = await Promise.all(
    newTags.map(async (tagName) => {
      const newTag = await Tags.create({
        tagName,
        tagBy: req.user._id,
      });
      return newTag;
    })
  );

  res.status(200).json({
    status: "success",
    result: createdTags,
  });
});
