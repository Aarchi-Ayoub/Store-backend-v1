const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "A client must have a name "],
    trim: true,
    maxlength: [40, "A client name must have less or equal then 40 characters"],
    minlength: [3, "A client name must have more or equal then 3 characters"],
  },
  cin: {
    type: "String",
    trim: true,
  },
  phoneNumber: Number,
  address: {
    type: "String",
    trim: true,
  },
  idAdmin: String,
});

const client = mongoose.model("client", clientSchema);

module.exports = client;
