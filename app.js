const mongoose = require("mongoose");
const mongoDBConfig = require("./mongodb.config");

mongoose.set("strictQuery", false);

const uri = `mongodb+srv://${mongoDBConfig.username}:${mongoDBConfig.password}@cluster0.xpetqvd.mongodb.net/inventory_app?retryWrites=true&w=majority&appName=Cluster0`;

mongoConnect().catch(console.dir);
async function mongoConnect() {
  // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
  await mongoose.connect(uri);
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const shoesRouter = require("./routes/shoes");
const brandsRouter = require("./routes/brands");
const stylesRouter = require("./routes/styles");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/shoes", shoesRouter);
app.use("/brands", brandsRouter);
app.use("/styles", stylesRouter);

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
