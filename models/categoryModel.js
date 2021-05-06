const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A category name must have less or equal then 40 characters'],
      minlength: [3, 'A category name must have more or equal then 3 characters']
    },
    // category:{
    //   type: String,
    //   trim: true
    // }
    description: String
  });

const category = mongoose.model('category', categorySchema);

module.exports = category;
