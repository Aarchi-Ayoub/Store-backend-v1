const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "A seller must have a name "],
    trim: true,
    maxlength: [40, "A seller name must have less or equal then 40 characters"],
    minlength: [3, "A seller name must have more or equal then 3 characters"],
  },
  phoneNumber: Number,
  address: {
    type: "String",
    trim: true,
  },
  about: {
    type: "String",
    trim: true,
  },
  idAdmin: {
    type: String,
    immutable: true,
  },
});

const seller = mongoose.model("seller", sellerSchema);

module.exports = seller;
