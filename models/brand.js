const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: { type: String, required: true, maxLength: 150 },
});

// Create a virtual property `domain` that's computed from `email`.
brandSchema.virtual("url").get(function () {
  return `/brands/${this._id}`;
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
