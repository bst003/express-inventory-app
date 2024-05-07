const async_handler = require("express-async-handler");
const { query, validationResult, body } = require("express-validator");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log(file);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({ storage: storage });

const cloudinary = require("cloudinary");
const cloudinaryConfig = require("../cloudinary.config");

const path = require("node:path");

const Shoe = require("../models/shoe");
const Style = require("../models/style");
const Brand = require("../models/brand");

const shoeController = {};

shoeController.shoes_list = async_handler(async (req, res, next) => {
  const shoes = await Shoe.find().sort({ name: "asc" }).exec();

  console.log(shoes);

  res.render("shoes/shoes_list", {
    title: "All Shoes",
    shoes: shoes,
  });
});

shoeController.shoes_detail = async_handler(async (req, res, next) => {
  const shoe = await Shoe.findById(req.params.id)
    .populate("brand style")
    .exec();

  console.log(shoe);

  res.render("shoes/shoes_detail", {
    title: "Shoe: " + shoe.name,
    shoe: shoe,
  });
});

shoeController.shoes_create_get = async_handler(async (req, res, next) => {
  const [styles, brands] = await Promise.all([
    Style.find().sort({ name: "asc" }).exec(),
    Brand.find().sort({ name: "asc" }).exec(),
  ]);

  const postUrl = req.originalUrl;

  res.render("shoes/shoes_form", {
    title: "Create Shoe",
    postUrl,
    styles,
    brands,
  });
});

shoeController.shoes_create_post = [
  upload.single("thumbnail"),

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

    let uploadedImagePath = path.resolve(req.file.path);

    console.log("uploaded image path: " + uploadedImagePath);

    // if errors return shoes_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const [styles, brands] = await Promise.all([
        Style.find().sort({ name: "asc" }).exec(),
        Brand.find().sort({ name: "asc" }).exec(),
      ]);

      const postUrl = req.originalUrl;

      res.render("shoes/shoes_form", {
        title: "Create Shoe",
        postUrl,
        styles,
        errors: result.errors,
        brands,
      });
    }

    // 1. upload thumbnail to cloudinary

    cloudinary.config({
      cloud_name: cloudinaryConfig.name,
      api_key: cloudinaryConfig.key,
      api_secret: cloudinaryConfig.secret,
    });

    console.log(cloudinary.config());

    const uploadImage = async (imagePath) => {
      // Use the uploaded file's name as the asset's public ID and
      // allow overwriting the asset with new versions
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(result);
        return {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      } catch (error) {
        console.error(error);
      }
    };

    const uploadedImage = await uploadImage(uploadedImagePath);

    console.log(uploadedImage);

    // 2. add image url to shoeDetails if file uploaded, if no upload then add empty property

    // If no errors then create shoe and redirect to shoe detail page
    const shoeDetails = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      style: req.body.style,
    };

    if (uploadedImage) {
      console.log("image uploaded to cloudinary");
      shoeDetails.thumbnail_id = uploadedImage.public_id;
      shoeDetails.thumbnail_url = uploadedImage.secure_url;
    }

    const newShoe = new Shoe(shoeDetails);
    await newShoe.save();

    // 3. Remove local upload

    res.redirect("/shoes/" + newShoe._id);
  }),
];

shoeController.shoes_delete_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const shoeId = parsedUrlPath.split("/")[1];

  const shoe = await Shoe.findById(shoeId).exec();

  const postUrl = req.originalUrl;

  res.render("shoes/shoes_delete", {
    title: "Delete Shoe: " + shoe.name,
    postUrl,
    shoe,
  });
});

shoeController.shoes_delete_post = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const shoeId = parsedUrlPath.split("/")[1];

  await Shoe.findByIdAndDelete(shoeId);

  res.redirect("/shoes");
});

shoeController.shoes_update_get = async_handler(async (req, res, next) => {
  const parsedUrlPath = req._parsedUrl.path;

  const shoeId = parsedUrlPath.split("/")[1];

  const [shoe, styles, brands] = await Promise.all([
    Shoe.findById(shoeId).exec(),
    Style.find().sort({ name: "asc" }).exec(),
    Brand.find().sort({ name: "asc" }).exec(),
  ]);

  const postUrl = req.originalUrl;

  res.render("shoes/shoes_form", {
    title: "Update Shoe: " + shoe.name,
    postUrl,
    shoe,
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

    const shoeId = parsedUrlPath.split("/")[1];

    const submittedShoeDetails = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      style: req.body.style,
    };

    // if errors return shoes_form and list errors
    if (!result.isEmpty()) {
      console.log(result);

      const [shoe, styles, brands] = await Promise.all([
        Shoe.findById(shoeId).exec(),
        Style.find().sort({ name: "asc" }).exec(),
        Brand.find().sort({ name: "asc" }).exec(),
      ]);

      const postUrl = req.originalUrl;

      res.render("shoes/shoes_form", {
        title: "Update Shoe: " + shoe.name,
        postUrl,
        shoe: submittedShoeDetails,
        styles,
        errors: result.errors,
        brands,
      });
    }

    // If no errors then create shoe and redirect to shoe detail page

    await Shoe.findByIdAndUpdate(shoeId, submittedShoeDetails);

    res.redirect("/shoes/" + shoeId);
  }),
];

module.exports = shoeController;
