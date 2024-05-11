const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

const Multer = require("../core/Multer");

const upload = Multer.upload;

const Cloudinary = require("../core/Cloudinary");

const Filesystem = require("../core/Filesystem");

const path = require("node:path");

const Brand = require("../models/brand");
const Shoe = require("../models/shoe");

const brandController = {};

brandController.brands_list = async_handler(async (req, res, next) => {
  const brands = await Brand.find().sort({ name: "asc" }).exec();

  console.log(brands);

  res.render("brands/brands_list", {
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

  res.render("brands/brands_detail", {
    title: "Brand: " + brand.name,
    brand,
    shoesInBrand,
  });
});

brandController.brands_create_get = async_handler(async (req, res, next) => {
  const postUrl = req.originalUrl;

  res.render("brands/brands_form", {
    title: "Create Brand",
    postUrl,
  });
});

brandController.brands_create_post = [
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

    const brandDetails = {
      name: req.body.name,
    };

    // if errors return brands_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      res.render("brands/brands_form", {
        title: "Create Brand",
        postUrl,
        brand: brandDetails,
        errors: result.errors,
      });
    }

    // If no errors then create brand and redirect to brand detail page

    if (uploadedImagePath) {
      Cloudinary.initConfig();
      const uploadedImage = await Cloudinary.uploadImage(uploadedImagePath);

      if (uploadedImage) {
        brandDetails.thumbnail_id = uploadedImage.public_id;
        brandDetails.thumbnail_url = uploadedImage.secure_url;
      }

      Filesystem.deleteFile(uploadedImagePath);
    }

    const newBrand = new Brand(brandDetails);
    await newBrand.save();

    res.redirect("/brands/" + newBrand._id);
  }),
];

brandController.brands_delete_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const brandId = parsedUrlPath.split("/")[1];

  const [brand, shoesInBrand] = await Promise.all([
    Brand.findById(brandId).exec(),
    Shoe.find({ brand: brandId }).exec(),
  ]);

  const postUrl = req.originalUrl;

  res.render("brands/brands_delete", {
    title: "Delete Brand: " + brand.name,
    postUrl,
    brand,
    shoesInBrand,
  });
});

brandController.brands_delete_post = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const brandId = parsedUrlPath.split("/")[1];

  const shoesInBrand = await Shoe.find({ brand: brandId }).exec();

  // Redirect back to detail page if there are shoes in brand
  if (shoesInBrand.length > 0) {
    res.redirect("/brands/" + brandId);
  }

  await Brand.findByIdAndDelete(brandId);

  res.redirect("/brands");
});

brandController.brands_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const brandId = parsedUrlPath.split("/")[1];

  const brand = await Brand.findById(brandId).exec();

  const postUrl = req.originalUrl;

  res.render("brands/brands_form", {
    title: "Update Brand: " + brand.name,
    brand,
    postUrl,
  });
});

brandController.brands_update_post = [
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

    const brandId = parsedUrlPath.split("/")[1];

    const brandDetails = {
      name: req.body.name,
    };

    // if errors return brands_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const postUrl = req.originalUrl;

      const brand = await Brand.findById(brandId).exec();

      res.render("brands/brands_form", {
        title: "Update Brand: " + brand.name,
        postUrl,
        brand: brandDetails,
        errors: result.errors,
      });
    }

    // If no errors then create brand and redirect to brand detail page

    if (uploadedImagePath) {
      Cloudinary.initConfig();
      const uploadedImage = await Cloudinary.uploadImage(uploadedImagePath);

      if (uploadedImage) {
        brandDetails.thumbnail_id = uploadedImage.public_id;
        brandDetails.thumbnail_url = uploadedImage.secure_url;
      }

      Filesystem.deleteFile(uploadedImagePath);
    }

    await Brand.findByIdAndUpdate(brandId, brandDetails);

    res.redirect("/brands/" + brandId);
  }),
];

module.exports = brandController;
