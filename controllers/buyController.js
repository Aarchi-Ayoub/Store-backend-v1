const Buy = require("../models/buyModel");
const Stock = require("../models/stockModel");
const Sale = require("../models/saleModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBuysProducts = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const buys = await Buy.find({ idAdmin: _id });
  res.status(200).json({
    status: "success",
    results: buys.length,
    data: {
      buys,
    },
  });
});

exports.addBuyProduct = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const newBuy = await Buy.create({ ...req.body, idAdmin: _id });
  const checkStock = await Stock.exists({
    idAdmin: _id,
    productName: newBuy.productName,
  });
  if (!checkStock) {
    await Stock.create({
      productName: newBuy.productName,
      currentQuantity: newBuy.quantity,
      buyQuantity: 0,
      priceBuy: newBuy.priceBuy,
      priceSale: newBuy.priceSale,
      idAdmin: _id,
    });
  } else {
    const stock = await Stock.findOne({
      idAdmin: _id,
      productName: newBuy.productName,
    });
    await Stock.findOneAndUpdate(
      { idAdmin: _id, productName: newBuy.productName },
      {
        $inc: { currentQuantity: newBuy.quantity },
        $set: {
          priceBuy:
            (stock.priceBuy * stock.currentQuantity +
              newBuy.quantity * newBuy.priceBuy) /
            (newBuy.quantity + stock.currentQuantity),
        },
        $set: { priceSale: newBuy.priceSale || stock.priceSale },
      }
    );
  }
  res.status(201).json({
    status: "success",
    data: {
      buy: newBuy,
    },
  });
});

exports.updateBuyProduct = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const buy = await Buy.findById(req.params.id);
  if (!buy) {
    return next(new AppError("No buy product found with that ID", 404));
  }
  const buyUpdated = await Buy.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //give the object after update
    runValidators: true,
  });

  const sale = await Sale.exists(
    { productName: buy.productName, idAdmin: _id },
    { $gte: { saleDate: buy.buyDate } }
  );

  if (sale) {
    return next(new AppError("Sorry you can not update this buy", 404));
  }
  const stock = await Stock.findOne({
    productName: buy.productName,
    idAdmin: _id,
  });
  if (stock.currentQuantity !== buy.quantity) {
    await Stock.findOneAndUpdate(
      { productName: buy.productName, idAdmin: _id },
      {
        $inc: { currentQuantity: -buy.quantity },
        $set: {
          priceBuy:
            (stock.priceBuy * stock.currentQuantity -
              buy.quantity * buy.priceBuy) /
            (buy.quantity - stock.currentQuantity),
        },
        $set: { priceSale: newBuy.priceSale || stock.priceSale },
      }
    );
  }
  await Stock.findOneAndUpdate(
    { productName: buyUpdated.productName, idAdmin: _id },
    {
      $set: { currentQuantity: buyUpdated.quantity },
      $set: { priceBuy: buyUpdated.priceBuy },
      $set: { priceSale: buyUpdated.priceSale || stock.priceSale },
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      buyUpdated,
    },
  });
});

exports.deleteBuyProduct = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;

  const buy = await Buy.findById(req.params.id);
  if (!buy) {
    return next(new AppError("No buy product found with that ID", 404));
  }

  const sale = await Sale.exists({
    productName: buy.productName,
    idAdmin: _id,
    $gte: { saleDate: buy.buyDate },
  });
  if (sale) {
    return next(new AppError("Sorry you can not delete this buy", 404));
  }

  const stock = await Stock.findOne({
    idAdmin: _id,
    productName: buy.productName,
  });
  if (stock.currentQuantity !== buy.quantity) {
    await Stock.findOneAndUpdate(
      { idAdmin: _id, productName: buy.productName },
      {
        $inc: { currentQuantity: -buy.quantity },
        $set: {
          priceBuy:
            (stock.priceBuy * stock.currentQuantity -
              buy.quantity * buy.priceBuy) /
            (buy.quantity - stock.currentQuantity),
        },
        $set: { priceSale: newBuy.priceSale || stock.priceSale },
      }
    );
  } else {
    await Stock.findOneAndDelete({
      idAdmin: _id,
      productName: buy.productName,
    });
  }
  await Buy.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
