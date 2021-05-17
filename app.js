const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const { emailInternalHelper } = require("./helpers/email.helper");

require("dotenv").config();

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const utilsHelper = require("./helpers/utils.helper");

const app = express();

mongoose
  .connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB database connection established successfully!`);
    emailInternalHelper.createTemplatesIfNotExists();
  })
  .catch((err) => console.error("Could not connect to database!", err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(passport.initialize());

app.use("/api", indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("404 - Resource not found");
  next(error);
});

// Initialize error handling
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  const statusCode = err.message.split(" - ")[0];
  const message = err.message.split(" - ")[1];
  if (!isNaN(statusCode)) {
    utilsHelper.sendResponse(res, statusCode, false, null, { message }, null);
  } else {
    utilsHelper.sendResponse(
      res,
      500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
