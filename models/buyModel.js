const mongoose = require("mongoose");

const buySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "A buy must have a name of product"],
    trim: true,
    immutable: true,
    maxlength: [
      40,
      "A product name must have less or equal then 40 characters",
    ],
    minlength: [3, "A product name must have more or equal then 3 characters"],
  },
  quantity: {
    type: Number,
    required: [true, "A buy must have a quantity"],
  },
  priceBuy: {
    type: Number,
    required: [true, "A buy must have a price"],
  },
  priceSale: {
    type: Number,
  },
  seller: {
    type: String,
    trim: true,
  },
  buyDate: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  idAdmin: {
    type: String,
    immutable: true,
  },
});

const buy = mongoose.model("buy", buySchema);

module.exports = buy;
