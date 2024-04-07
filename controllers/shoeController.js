const async_handler = require("express-async-handler");

const shoe = require("../models/shoe");

const shoeController = {};

shoeController.shoes_list = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES LIST");
});

shoeController.shoes_detail = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES DETAIL");
});

shoeController.shoes_create_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES CREATE GET");
});

shoeController.shoes_create_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES CREATE POST");
});

shoeController.shoes_delete_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES DELETE GET");
});

shoeController.shoes_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES DELETE POST");
});

shoeController.shoes_update_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES UPDATE GET");
});

shoeController.shoes_update_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES UPDATE POST");
});

module.exports = shoeController;
