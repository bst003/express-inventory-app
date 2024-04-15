const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const styleSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 150 },
});

styleSchema.virtual("url").get(function () {
  return `/styles/${this._id}`;
});

const Style = mongoose.model("Style", styleSchema);

module.exports = Style;
