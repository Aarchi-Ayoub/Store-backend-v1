const Seller = require("../models/sellerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Buy = require("../models/buyModel");

exports.getAllSellers = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const sellers = await Seller.find({ idAdmin: _id });

  res.status(200).json({
    status: "success",
    results: sellers.length,
    data: {
      sellers,
    },
  });
});

exports.addSeller = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const newSeller = await Seller.create({ ...req.body, idAdmin: _id });

  res.status(201).json({
    status: "success",
    data: {
      Seller: newSeller,
    },
  });
});

exports.updateSeller = catchAsync(async (req, res, next) => {
  const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!seller) {
    return next(new AppError("No seller found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      seller,
    },
  });
});

exports.deleteSeller = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;

  const seller = await Seller.findById(req.params.id);
  if (!seller) {
    return next(new AppError("No seller found with that ID", 404));
  }
  const buy = Buy.findOne({ seller: seller.name, idAdmin: _id });
  if (buy) {
    return next(new AppError("You cannot delete that seller ", 404));
  }
  await Seller.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
