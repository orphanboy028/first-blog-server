const mongoose = require("mongoose");
const slugify = require("slugify");

const TagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      require: [true, "Please Provide your tag!"],
      unique: true,
    },
    tagSlug: {
      type: String,
      unique: true,
    },

    tagBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TagSchema.pre("save", function (next) {
  this.tagSlug = slugify(this.tagName, {
    lower: true,
  });

  next();
});

const Tags = mongoose.model("Tags", TagSchema);

module.exports = Tags;
