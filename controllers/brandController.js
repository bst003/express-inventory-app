const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

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
  const postUrl = req.originalUrl;

  res.render("brands_form", {
    title: "Create Brand",
    postUrl,
  });
});

brandController.brands_create_post = [
  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),
  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    console.log(req);

    // if errors return shoes_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      res.render("shoes_form", {
        title: "Create Shoe",
        postUrl,
        errors: result.errors,
      });
    }

    // If no errors then create shoe and redirect to shoe detail page
    const brandDetails = {
      name: req.body.name,
    };

    const newBrand = new Brand(brandDetails);
    await newBrand.save();

    res.render("brands_detail", {
      title: "Brand: ",
      shoesInBrand: [],
      brand: brandDetails,
    });
  }),
];

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
