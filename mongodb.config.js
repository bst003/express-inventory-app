const dotenv = require("dotenv");
dotenv.config();

const config = {
  username: process.env.MONGO_DB_USERNAME,
  password: process.env.MONGO_DB_PASSWORD,
};

module.exports = config;
