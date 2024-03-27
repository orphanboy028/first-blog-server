const express = require("express");
const app = express();
const globalErrorHandler = require("./utils/errorController");
const BlogRoute = require("./routes/BlogRoutes");
const authRoute = require("./routes/authRoute");
const commentRoute = require("./routes/blogCommentRoute");
const userRoute = require("./routes/userRoute");
const tagRoute = require("./routes/tagRoute");
const statsRoute = require("./routes/statsRoute");

const cors = require("cors");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/first-blog/blog", BlogRoute);
app.use("/api/v1/first-blog/auth", authRoute);
app.use("/api/v1/first-blog/blog-comment", commentRoute);
app.use("/api/v1/first-blog/user", userRoute);
app.use("/api/v1/first-blog/tag", tagRoute);
app.use("/api/v1/first-blog/stats", statsRoute);

app.use(globalErrorHandler);
module.exports = app;
