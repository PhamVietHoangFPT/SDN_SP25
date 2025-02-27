var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//import Routers
// const characterRouter = require('./routes/characterRouter');

const manageProductRouter = require("./routes/manageProductRoutes");
const accountRouter = require('./routes/accountRouter');
const productRouter = require('./routes/productRouter');
const productReviewRouter = require('./routes/productReviewRouter');
const authRouter = require('./routes/authRouter');


var app = express();
const uri = process.env.MONGO_URI;
const connect = mongoose.connect(uri);
connect.then((db) => {
  console.log("Connect ok");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// app.use('/characters', characterRouter);
app.use("/accounts", accountRouter);
app.use("/products", productRouter);
app.use("/productReviews", productReviewRouter);
app.use("/manage/products", manageProductRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
