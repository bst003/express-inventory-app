const async_handler = require("express-async-handler");

const Brand = require("../models/brand");
const Shoe = require("../models/shoe");

const brandController = {};

brandController.brands_list = async_handler(async (req, res, next) => {
  const brands = await Brand.find().sort({ name: "asc" }).exec();

  console.log(brands);

  res.render("brands_list", {
    title: "All Brands",
    brands: brands,
  });
});

brandController.brands_detail = async_handler(async (req, res, next) => {
  const [brand, shoesInBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Shoe.find({ brand: req.params.id }).exec(),
  ]);

  console.log(brand);

  res.render("brands_detail", {
    title: "Brand: ",
    brand,
    shoesInBrand,
  });
});

brandController.brands_create_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS CREATE GET");
});

brandController.brands_create_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS CREATE POST");
});

brandController.brands_delete_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS DELETE GET");
});

brandController.brands_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS DELETE POST");
});

brandController.brands_update_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS UPDATE GET");
});

brandController.brands_update_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS UPDATE POST");
});

module.exports = brandController;
