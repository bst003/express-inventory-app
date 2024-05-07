const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shoeSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 150 },
  description: { type: String, maxlength: 300 },
  price: { type: Number, required: true, min: 1 },
  thumbnail_id: { type: String, minlength: 5 },
  thumbnail_url: { type: String, minlength: 5 },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  style: { type: Schema.Types.ObjectId, ref: "Style" },
});

shoeSchema.virtual("url").get(function () {
  return `/shoes/${this._id}`;
});

const Shoe = mongoose.model("shoe", shoeSchema);

module.exports = Shoe;
