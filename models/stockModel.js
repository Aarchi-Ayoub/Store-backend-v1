const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName: {
    type: "String",
    required: [true, "A stock must have a name of product"],
    trim: true,
    immutable: true,
    maxlength: [40, "A stock name must have less or equal then 40 characters"],
    minlength: [3, "A stock name must have more or equal then 3 characters"],
  },
  currentQuantity: {
    type: Number,
    required: [true, "A stock must have a current quantity"],
  },
  priceBuy: {
    type: Number,
  },
  priceSale: {
    type: Number,
  },
  idAdmin: {
    type: String,
    immutable: true,
  },
});

const stock = mongoose.model("stock", stockSchema);

module.exports = stock;
