const dotenv = require("dotenv");
dotenv.config();

const config = {
  name: process.env.CLOUDINARY_NAME,
  key: process.env.CLOUDINARY_KEY,
  secret: process.env.CLOUDINARY_SECRET,
};

module.exports = config;
