const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shoeSchema = new Schema({
  name: { type: String, required: true, maxlength: 150 },
  description: { type: String, maxlength: 300 },
  price: { type: Number, required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  style: { type: Schema.Types.ObjectId, ref: "Style" },
});

shoeSchema.virtual("url").get(function () {
  return `/shoe/${this._id}`;
});

const Shoe = mongoose.model("shoe", shoeSchema);

module.exports = Shoe;
