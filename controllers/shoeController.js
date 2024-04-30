const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

const Shoe = require("../models/shoe");
const Style = require("../models/style");
const Brand = require("../models/brand");

const shoeController = {};

shoeController.shoes_list = async_handler(async (req, res, next) => {
  const shoes = await Shoe.find().sort({ name: "asc" }).exec();

  console.log(shoes);

  res.render("shoes_list", {
    title: "All Shoes",
    shoes: shoes,
  });
});

shoeController.shoes_detail = async_handler(async (req, res, next) => {
  const shoe = await Shoe.findById(req.params.id)
    .populate("brand style")
    .exec();

  console.log(shoe);

  res.render("shoes_detail", {
    title: "Shoe: ",
    shoe: shoe,
  });
});

shoeController.shoes_create_get = async_handler(async (req, res, next) => {
  const [styles, brands] = await Promise.all([
    Style.find().sort({ name: "asc" }).exec(),
    Brand.find().sort({ name: "asc" }).exec(),
  ]);

  const postUrl = req.originalUrl;

  res.render("shoes_form", {
    title: "Create Shoe",
    postUrl,
    styles,
    brands,
  });
});

shoeController.shoes_create_post = [
  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),
  body("description")
    .optional({ checkFalsy: true })
    .isLength({ max: 300 })
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Descriptions must not be over 300 characters"),
  body("price")
    .isInt({ min: 1 })
    .trim()
    .withMessage("Price needs to be at least 1"),
  body("brand")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Brand must not be empty"),
  body("style")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Style must not be empty"),
  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    console.log(req);

    // if errors return shoes_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const [styles, brands] = await Promise.all([
        Style.find().sort({ name: "asc" }).exec(),
        Brand.find().sort({ name: "asc" }).exec(),
      ]);

      const postUrl = req.originalUrl;

      res.render("shoes_form", {
        title: "Create Shoe",
        postUrl,
        styles,
        errors: result.errors,
        brands,
      });
    }

    // If no errors then create shoe and redirect to shoe detail page
    const shoeDetails = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      style: req.body.style,
    };

    const newShoe = new Shoe(shoeDetails);
    await newShoe.save();

    res.render("shoes_detail", {
      title: "Shoe: ",
      shoe: shoeDetails,
    });
  }),
];

shoeController.shoes_delete_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES DELETE GET");
});

shoeController.shoes_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, SHOES DELETE POST");
});

shoeController.shoes_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const currentShoeId = parsedUrlPath.split("/")[1];

  const [currentShoe, styles, brands] = await Promise.all([
    Shoe.findById(currentShoeId).exec(),
    Style.find().sort({ name: "asc" }).exec(),
    Brand.find().sort({ name: "asc" }).exec(),
  ]);

  const postUrl = req.originalUrl;

  res.render("shoes_form", {
    title: "Update Shoe: " + currentShoe.name,
    postUrl,
    shoe: currentShoe,
    styles,
    brands,
  });
});

shoeController.shoes_update_post = [
  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),
  body("description")
    .optional({ checkFalsy: true })
    .isLength({ max: 300 })
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Descriptions must not be over 300 characters"),
  body("price")
    .isInt({ min: 1 })
    .trim()
    .withMessage("Price needs to be at least 1"),
  body("brand")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Brand must not be empty"),
  body("style")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Style must not be empty"),
  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    console.log(req);

    const parsedUrlPath = req._parsedUrl.path;

    // if errors return shoes_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const [styles, brands] = await Promise.all([
        Style.find().sort({ name: "asc" }).exec(),
        Brand.find().sort({ name: "asc" }).exec(),
      ]);

      const postUrl = req.originalUrl;

      res.render("shoes_form", {
        title: "Update Shoe",
        postUrl,
        styles,
        errors: result.errors,
        brands,
      });
    }

    // If no errors then create style and redirect to brand detail page

    const currentShoeId = parsedUrlPath.split("/")[1];

    const shoeDetails = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      style: req.body.style,
    };

    await Shoe.findByIdAndUpdate(currentShoeId, shoeDetails);

    res.redirect("/shoes/" + currentShoeId);
  }),
];

module.exports = shoeController;
