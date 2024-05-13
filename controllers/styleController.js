const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

const Multer = require("../core/Multer");

const upload = Multer.upload;

const Cloudinary = require("../core/Cloudinary");

const Filesystem = require("../core/Filesystem");

const path = require("node:path");

const Style = require("../models/style");
const Shoe = require("../models/shoe");

const styleController = {};

styleController.styles_list = async_handler(async (req, res, next) => {
  const styles = await Style.find().sort({ name: "asc" }).exec();

  res.render("styles/styles_list", {
    title: "All Styles",
    styles: styles,
    cloudinaryName: Cloudinary.configName(),
  });
});

styleController.styles_detail = async_handler(async (req, res, next) => {
  const [style, shoesInStyle] = await Promise.all([
    Style.findById(req.params.id).exec(),
    Shoe.find({ style: req.params.id }).exec(),
  ]);

  res.render("styles/styles_detail", {
    title: "Style: " + style.name,
    style,
    shoesInStyle,
    cloudinaryName: Cloudinary.configName(),
  });
});

styleController.styles_create_get = async_handler(async (req, res, next) => {
  const postUrl = req.originalUrl;

  res.render("styles/styles_form", {
    title: "Create Style",
    postUrl,
  });
});

styleController.styles_create_post = [
  upload.single("thumbnail"),

  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),

  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    let uploadedImagePath;

    if (req.file !== undefined) {
      uploadedImagePath = path.resolve(req.file.path);
    }

    const styleDetails = {
      name: req.body.name,
    };

    // if errors return styles_form and list errors

    if (!result.isEmpty()) {
      const postUrl = req.originalUrl;

      res.render("styles/styles_form", {
        title: "Create Style",
        postUrl,
        style: styleDetails,
        errors: result.errors,
      });
    }

    // If no errors then create style and redirect to style detail page

    if (uploadedImagePath) {
      Cloudinary.initConfig();
      const uploadedImage = await Cloudinary.uploadImage(uploadedImagePath);

      if (uploadedImage) {
        styleDetails.thumbnail_id = uploadedImage.public_id;
        styleDetails.thumbnail_url = uploadedImage.secure_url;
      }

      Filesystem.deleteFile(uploadedImagePath);
    }

    const newStyle = new Style(styleDetails);
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

  res.render("styles/styles_delete", {
    title: "Delete Style: " + style.name,
    postUrl,
    style,
    shoesInStyle,
  });
});

styleController.styles_delete_post = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const styleId = parsedUrlPath.split("/")[1];

  const shoesInStyle = await Shoe.find({ style: styleId }).exec();

  // Redirect back to detail page if there are shoes in style
  if (shoesInStyle.length > 0) {
    res.redirect("/styles/" + styleId);
  }

  await Style.findByIdAndDelete(styleId);

  res.redirect("/styles");
});

styleController.styles_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const styleId = parsedUrlPath.split("/")[1];

  const style = await Style.findById(styleId).exec();

  const postUrl = req.originalUrl;

  res.render("styles/styles_form", {
    title: "Update Style: " + style.name,
    style: style,
    postUrl,
  });
});

styleController.styles_update_post = [
  upload.single("thumbnail"),

  body("name")
    .isLength({ min: 3, max: 150 })
    .trim()
    .escape()
    .withMessage("Name must be between 3 and 150 characters"),

  async_handler(async (req, res, next) => {
    const result = validationResult(req);

    let uploadedImagePath;

    if (req.file !== undefined) {
      uploadedImagePath = path.resolve(req.file.path);
    }

    const parsedUrlPath = req._parsedUrl.path;

    const styleId = parsedUrlPath.split("/")[1];

    const styleDetails = {
      name: req.body.name,
    };

    // if errors return styles_form and list errors
    if (!result.isEmpty()) {
      const postUrl = req.originalUrl;

      const style = await Style.findById(styleId).exec();

      res.render("styles/styles_form", {
        title: "Update Style: " + style.name,
        postUrl,
        style: styleDetails,
        errors: result.errors,
      });
    }

    // If no errors then create style and redirect to style detail page

    if (uploadedImagePath) {
      Cloudinary.initConfig();
      const uploadedImage = await Cloudinary.uploadImage(uploadedImagePath);

      if (uploadedImage) {
        styleDetails.thumbnail_id = uploadedImage.public_id;
        styleDetails.thumbnail_url = uploadedImage.secure_url;
      }

      Filesystem.deleteFile(uploadedImagePath);
    }

    await Style.findByIdAndUpdate(styleId, styleDetails);

    res.redirect("/styles/" + styleId);
  }),
];

module.exports = styleController;
