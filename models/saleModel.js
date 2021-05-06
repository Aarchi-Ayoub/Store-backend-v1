const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productName: {
    type: "String",
    required: [true, "A sale must have a name of product"],
    trim: true,
    maxlength: [
      40,
      "A product name must have less or equal then 40 characters",
    ],
    minlength: [3, "A product name must have more or equal then 3 characters"],
  },
  quantity: {
    type: Number,
    required: [true, "A sale must have a quantity of product"],
  },
  priceBuy: {
    type: Number,
    required: [true, "A sale must have a price "],
  },
  priceSale: {
    type: Number,
    required: [true, "A sale must have a price "],
  },
  profit: {
    type: Number,
    required: [true, "A sale must have a price "],
  },
  saleDate: {
    type: Date,
    default: Date.now,
    immutable: true,
    select: false,
  },
  idAdmin: {
    type: String,
    immutable: true,
  },
});

const sale = mongoose.model("sale", saleSchema);

module.exports = sale;
