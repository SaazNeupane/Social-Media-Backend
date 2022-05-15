const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

// Config
require("dotenv").config({ path: "./config/config.env" });

app.use(express.json());
app.use(cookieParser());

const userRoutes = require("./routes/user");
const followerRoutes = require("./routes/followers");

app.use("/api/v1/", userRoutes, followerRoutes);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
