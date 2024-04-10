const async_handler = require("express-async-handler");

const Style = require("../models/style");

const styleController = {};

styleController.styles_list = async_handler(async (req, res, next) => {
  const styles = await Style.find().exec();

  console.log(styles);

  res.render("styles_list", {
    title: "All Styles",
    styles: styles,
  });
});

styleController.styles_detail = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES DETAIL");
});

styleController.styles_create_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES CREATE GET");
});

styleController.styles_create_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES CREATE POST");
});

styleController.styles_delete_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES DELETE GET");
});

styleController.styles_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES DELETE POST");
});

styleController.styles_update_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES UPDATE GET");
});

styleController.styles_update_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES UPDATE POST");
});

module.exports = styleController;
