const mongoose = require("mongoose");

const Schema = mongoose.schema();

const brandSchema = new Schema({
  name: { type: String, required: true, maxLength: 150 },
});

// Create a virtual property `domain` that's computed from `email`.
brandSchema.virtual("url").get(function () {
  return `/brand/${this._id}`;
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
