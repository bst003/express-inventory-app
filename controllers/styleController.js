const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

const Style = require("../models/style");
const Shoe = require("../models/shoe");
4;

/*

REFACTOR VARIABLES NAMES TO BE MORE CONSISTENT WITH BRAND VAR NAMES

*/

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
    title: "Style: " + style.name,
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

    const submittedStyleDetails = {
      name: req.body.name,
    };

    // if errors return styles_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      res.render("styles_form", {
        title: "Create Style",
        postUrl,
        style: submittedStyleDetails,
        errors: result.errors,
      });
    }

    // If no errors then create style and redirect to style detail page
    const newStyle = new Style(submittedStyleDetails);
    await newStyle.save();

    res.redirect("/styles/" + newStyle._id);
  }),
];

styleController.styles_delete_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const styleId = parsedUrlPath.split("/")[1];

  const [style, shoesInStyle] = await Promise.all([
    Style.findById(styleId).exec(),
    Shoe.find({ style: styleId }).exec(),
  ]);

  const postUrl = req.originalUrl;

  res.render("styles_delete", {
    title: "Delete Style: " + style.name,
    postUrl,
    style,
    shoesInStyle,
  });
});

styleController.styles_delete_post = async_handler(async (req, res, next) => {
  res.send("NOT YET IMPLEMENTED, STYLES DELETE POST");
});

styleController.styles_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const styleId = parsedUrlPath.split("/")[1];

  const style = await Style.findById(styleId).exec();

  const postUrl = req.originalUrl;

  res.render("styles_form", {
    title: "Update Style: " + style.name,
    style: style,
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

    const styleId = parsedUrlPath.split("/")[1];

    const submittedStyleDetails = {
      name: req.body.name,
    };

    // if errors return styles_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      const style = await Style.findById(styleId).exec();

      res.render("styles_form", {
        title: "Update Style: " + style.name,
        postUrl,
        style: submittedStyleDetails,
        errors: result.errors,
      });
    }

    // If no errors then create style and redirect to style detail page

    await Style.findByIdAndUpdate(styleId, submittedStyleDetails);

    res.redirect("/styles/" + styleId);
  }),
];

module.exports = styleController;
