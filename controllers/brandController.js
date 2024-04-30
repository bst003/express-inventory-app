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
    title: "Brand: " + brand.name,
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

    const submittedBrandDetails = {
      name: req.body.name,
    };

    // if errors return brands_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      res.render("brands_form", {
        title: "Create Brand",
        postUrl,
        brand: submittedBrandDetails,
        errors: result.errors,
      });
    }

    // If no errors then create brand and redirect to brand detail page

    const newBrand = new Brand(brandDetails);
    await newBrand.save();

    res.redirect("/brands/" + newBrand._id);
  }),
];

brandController.brands_delete_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS DELETE GET");
});

brandController.brands_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, BRANDS DELETE POST");
});

brandController.brands_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const currentBrandId = parsedUrlPath.split("/")[1];

  const currentBrand = await Brand.findById(currentBrandId).exec();

  const postUrl = req.originalUrl;

  res.render("brands_form", {
    title: "Update Brand: " + currentBrand.name,
    brand: currentBrand,
    postUrl,
  });
});

brandController.brands_update_post = [
  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),
  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    console.log(req);

    const parsedUrlPath = req._parsedUrl.path;

    const currentBrandId = parsedUrlPath.split("/")[1];

    const submittedBrandDetails = {
      name: req.body.name,
    };

    // if errors return brands_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      const currentBrand = await Brand.findById(currentBrandId).exec();

      res.render("brands_form", {
        title: "Update Brand: " + currentBrand.name,
        postUrl,
        brand: submittedBrandDetails,
        errors: result.errors,
      });
    }

    // If no errors then create brand and redirect to brand detail page

    await Brand.findByIdAndUpdate(currentBrandId, submittedBrandDetails);

    res.redirect("/brands/" + currentBrandId);
  }),
];

module.exports = brandController;
