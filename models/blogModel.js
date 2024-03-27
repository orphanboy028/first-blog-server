const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Please mention first blog Title"],
    },

    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },

    descreption: {
      type: String,
    },

    blogTags: [
      {
        tagName: { type: String },
        tagSlug: { type: String },
      },
    ],

    BlogThumblin: {
      url: {
        type: String,
      },
      altText: {
        type: String,
      },
    },

    keywords: {
      type: String,
    },

    metaDescription: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    rankPosition: {
      type: Number,
      default: 0,
    },
    posteBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, {
    lower: true,
  });

  next();
});

blogSchema.pre("save", function (next) {
  this.blogTags.forEach((tag) => {
    tag.tagSlug = slugify(tag.tagName, { lower: true });
  });
  next();
});

// Virtual Populate
blogSchema.virtual("comments", {
  ref: "BlogComments",
  foreignField: "blog",
  localField: "_id",
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "posteBy",
    select: "name email role",
  });
  next();
});

const Blogs = mongoose.model("Blogs", blogSchema);

module.exports = Blogs;
