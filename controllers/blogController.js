const Blogs = require("../models/blogModel");
const Factory = require("../utils/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createBlog = Factory.createOne(Blogs);
exports.getAllBlogs = Factory.getAll(Blogs);
// exports.getSingleBlog = Factory.getOneBySlug(Blogs);

exports.blogCreate = catchAsync(async (req, res, next) => {
  const image = req.files[0].filename;
  const { title, descreption, metaDescription } = req.body;
  console.log(image);
  const doc = await Blogs.create({
    title,
    descreption,
    metaDescription,
    BlogThumblin: {
      url: image,
      altText: "this is alttext",
    },
    posteBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    result: doc,
  });
});

exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ slug: req.params.slug })
      .populate({
        path: "comments",
        select: "comment blog ",
      })
      .exec();

    await Blogs.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewCount: 1 } }, // Increment viewCount by 1
      { new: true } // Return the updated document
    );
    res.status(200).json({
      status: "success",
      result: blog,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

exports.updateViewCount = catchAsync(async (req, res, next) => {
  const blog = await Blogs.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { viewCount: 1 } }, // Increment viewCount by 1
    { new: true } // Return the updated document
  );

  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "View count updated successfully",
    result: blog,
  });
});

exports.getUserPublisheBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blogs.find({ posteBy: req.user._id, isActive: true });

  res.status(200).json({
    status: "success",
    result: blogs,
  });
});

exports.getUserDraftBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blogs.find({ posteBy: req.user._id, isActive: false });
  console.log(blogs);
  res.status(200).json({
    status: "success",
    result: blogs,
  });
});

exports.updateblogIsActive = catchAsync(async (req, res, next) => {
  const { _id } = req.body;
  const existingBlog = await Blogs.findById(_id);

  if (!existingBlog) {
    return next(new AppError("Blog post not found"));
  }

  // Toggle the isActive field
  existingBlog.isActive = !existingBlog.isActive;

  // Save the updated blog document
  const updatedBlog = await existingBlog.save();

  res.status(200).json({
    status: "success",
    result: updatedBlog,
  });
});

// Update Blog tags

exports.getFilteredBlogs = async (req, res) => {
  try {
    const tag = req.query.tag;
    console.log(tag);
    const limit = parseInt(req.query.limit) || 5; // Default limit to 10 if not provided
    const page = parseInt(req.query.page) || 2;
    const skip = (page - 1) * limit;

    const filter = tag ? { "blogTags.tagSlug": tag } : {};
    console.log(filter);
    const blogs = await Blogs.find(filter)
      .populate({
        path: "comments",
        select: "comment blog ",
      })
      .skip(skip)
      .limit(limit)
      .exec();
    res.status(200).json({
      status: "succes",
      total: blogs.length,
      result: blogs,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

exports.getSearchBlogs = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive regex pattern

    const blogs = await Blogs.find({
      $or: [
        { title: regex }, // Search in title
        { metaDescription: regex }, // Search in metaDescription
      ],
    });

    res.status(200).json({
      status: "succes",
      total: blogs.length,
      result: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlogTag = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  console.log(req.body);
  const { tagName } = req.body;

  console.log("tags");

  const blog = await Blogs.findById(_id);

  if (!blog) {
    return next(new AppError("Blog post not found"));
  }

  if (!Array.isArray(tagName)) {
    return next(new AppError("tagName must be an array"));
  }

  const existingTags = blog.blogTags.map((tag) => tag.tagName);

  const newTags = [];

  for (let name of tagName) {
    if (!existingTags.includes(name)) {
      newTags.push(name);
    }
  }

  newTags.forEach((name) => {
    blog.blogTags.push({ tagName: name });
  });

  await blog.save();

  res.status(200).json({
    status: "success",
    result: blog,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { _id } = req.body;
  console.log(_id);

  const blogDelete = await Blogs.findByIdAndDelete(_id);

  res.status(200).json({
    status: "success",
    result: blogDelete,
  });
});

exports.blogsByTag = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const filter = slug ? { "blogTags.tagSlug": slug } : {};
  const blogs = await Blogs.find(filter);

  res.status(200).json({
    status: "succes",
    total: blogs.length,
    result: blogs,
  });
});

// ADMINS
exports.getAllAdminBlogs = catchAsync(async (req, res, next) => {
  const allblogs = await Blogs.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "succes",
    total: allblogs.length,
    result: allblogs,
  });
});
