const Stock = require("../models/stockModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllStock = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const stock = await Stock.find({ idAdmin: _id });

  res.status(200).json({
    status: "success",
    results: stock.length,
    data: {
      stock,
    },
  });
});
