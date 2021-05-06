const Sale = require("../models/saleModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Stock = require("../models/stockModel");

exports.getAllSales = catchAsync(async (req, res, next) => {
  const {
    user: { idAdmin },
  } = req;
  const sales = await Sale.find({ idAdmin: idAdmin });

  res.status(200).json({
    status: "success",
    results: sales.length,
    data: {
      sales,
    },
  });
});

exports.addSale = catchAsync(async (req, res, next) => {
  const {
    user: { idAdmin },
  } = req;
  const stock = await Stock.findOne({
    idAdmin: idAdmin,
    productName: req.body.productName,
  });
  if (!stock) {
    return next(new AppError("No product in stock found with that name", 404));
  }
  if (stock.currentQuantity > req.body.quantity) {
    await Stock.findOneAndUpdate(
      {
        idAdmin: idAdmin,
        productName: req.body.productName,
      },
      { $inc: { currentQuantity: -req.body.quantity } }
    );
  } else if (stock.currentQuantity == req.body.quantity) {
    await Stock.findOneAndDelete({
      idAdmin: idAdmin,
      productName: req.body.productName,
    });
  } else {
    return next(
      new AppError("the quantity in stock less than the quantity sold", 404)
    );
  }

  const newSale = await Sale.create({
    ...req.body,
    priceBuy: stock.priceBuy,
    idAdmin: idAdmin,
    profit:
      req.body.quantity * req.body.priceSale -
      req.body.priceBuy * req.body.quantity,
  });
  res.status(201).json({
    status: "success",
    data: {
      Sale: newSale,
    },
  });
});

exports.updateSale = catchAsync(async (req, res, next) => {
  const {
    user: { idAdmin },
  } = req;
  const sale = await Sale.findById(req.params.id);
  if (!sale) {
    return next(new AppError("No sale found with that ID", 404));
  }

  const stock = await Stock.findOne({
    idAdmin: idAdmin,
    productName: sale.productName,
  });
  let stockUpdeted;
  if (!stock) {
    stockUpdeted = await Stock.create({
      productName: req.body.productName,
      currentQuantity: req.body.quantity,
      priceBuy: req.body.priceBuy,
      priceSale: req.body.priceSale,
      idAdmin: idAdmin,
    });
  } else {
    stockUpdeted = await Stock.findOneAndUpdate(
      {
        idAdmin: idAdmin,
        productName: sale.productName,
      },
      { $inc: { currentQuantity: sale.quantity } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  if (stockUpdeted.currentQuantity > req.body.quantity) {
    await Stock.findOneAndUpdate(
      {
        idAdmin: idAdmin,
        productName: sale.productName,
      },
      { $inc: { currentQuantity: -sale.quantity } }
    );
  } else if (stock.currentQuantity == req.body.quantity) {
    await Stock.findOneAndDelete({
      idAdmin: idAdmin,
      productName: req.body.productName,
    });
  } else {
    return next(
      new AppError("the quantity in stock less than the quantity sold", 404)
    );
  }

  const saleUpdeted = await Sale.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      profit:
        req.body.quantity * req.body.priceSale -
        req.body.priceBuy * req.body.quantity,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      saleUpdeted,
    },
  });
});

exports.deleteSale = catchAsync(async (req, res, next) => {
  const {
    user: { idAdmin },
  } = req;
  const sale = await Sale.findById(req.params.id);
  if (!sale) {
    return next(new AppError("No sale found with that ID", 404));
  }

  const stock = await Stock.findOne({
    idAdmin: idAdmin,
    productName: sale.productName,
  });
  let stockUpdeted;
  if (!stock) {
    stockUpdeted = await Stock.create({
      productName: req.body.productName,
      currentQuantity: req.body.quantity,
      priceBuy: req.body.priceBuy,
      priceSale: req.body.priceSale,
      idAdmin: idAdmin,
    });
  } else {
    stockUpdeted = await Stock.findOneAndUpdate(
      {
        idAdmin: idAdmin,
        productName: sale.productName,
      },
      { $inc: { currentQuantity: sale.quantity } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  await Sale.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
