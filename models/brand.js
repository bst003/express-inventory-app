const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 150 },
  thumbnail_id: { type: String, minlength: 5 },
  thumbnail_url: { type: String, minlength: 5 },
});

brandSchema.virtual("url").get(function () {
  return `/brands/${this._id}`;
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
