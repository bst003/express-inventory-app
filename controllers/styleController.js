const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

const Style = require("../models/style");
const Shoe = require("../models/shoe");

const styleController = {};

styleController.styles_list = async_handler(async (req, res, next) => {
  const styles = await Style.find().sort({ name: "asc" }).exec();

  console.log(styles);

  res.render("styles_list", {
    title: "All Styles",
    styles: styles,
  });
});

styleController.styles_detail = async_handler(async (req, res, next) => {
  const [style, shoesInStyle] = await Promise.all([
    Style.findById(req.params.id).exec(),
    Shoe.find({ style: req.params.id }).exec(),
  ]);

  console.log(style);

  res.render("styles_detail", {
    title: "Style: ",
    style,
    shoesInStyle,
  });
});

styleController.styles_create_get = async_handler(async (req, res, next) => {
  const postUrl = req.originalUrl;

  res.render("styles_form", {
    title: "Create Style",
    postUrl,
  });
});

styleController.styles_create_post = [
  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),
  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    console.log(req);

    // if errors return styles_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      res.render("styles_form", {
        title: "Create Style",
        postUrl,
        errors: result.errors,
      });
    }

    // If no errors then create style and redirect to style detail page
    const styleDetails = {
      name: req.body.name,
    };

    const newStyle = new Style(styleDetails);
    await newStyle.save();

    res.render("styles_detail", {
      title: "Styles: ",
      shoesInStyle: [],
      style: styleDetails,
    });
  }),
];

styleController.styles_delete_get = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES DELETE GET");
});

styleController.styles_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES DELETE POST");
});

styleController.styles_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const currentStyleId = parsedUrlPath.split("/")[1];

  const currentStyle = await Style.findById(currentStyleId).exec();

  const postUrl = req.originalUrl;

  res.render("styles_form", {
    title: "Update Style",
    style: currentStyle,
    postUrl,
  });
});

styleController.styles_update_post = [
  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),
  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    console.log(req);

    const parsedUrlPath = req._parsedUrl.path;

    // if errors return styles_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      const styleDetails = {
        name: req.body.name,
      };

      res.render("styles_form", {
        title: "Update Style",
        postUrl,
        brand: styleDetails,
        errors: result.errors,
      });
    }

    // If no errors then create style and redirect to brand detail page

    const currentStyleId = parsedUrlPath.split("/")[1];

    const styleDetails = {
      name: req.body.name,
    };

    await Style.findByIdAndUpdate(currentStyleId, styleDetails);

    res.redirect("/styles/" + currentStyleId);
  }),
];

module.exports = styleController;
