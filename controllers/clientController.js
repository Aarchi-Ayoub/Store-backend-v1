const Client = require("../models/clientModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Client = require("../models/clientModel");
const PrePay = require("../models/prePayModel");

exports.getAllClients = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const clients = await Client.find({ idAdmin: _id });

  res.status(200).json({
    status: "success",
    results: clients.length,
    data: {
      clients,
    },
  });
});

exports.addClient = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const newClient = await Client.create({ ...req.body, idAdmin: _id });

  res.status(201).json({
    status: "success",
    data: {
      Client: newClient,
    },
  });
});

exports.updateClient = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const client = await Client.findById(req.params.id);
  if (!client) {
    return next(new AppError("No client found with that ID", 404));
  }
  if (client.name !== req.body.name) {
    const credit = await Credit.exists({
      idAdmin: _id,
      clientName: client.name,
    });
    const prePay = await PrePay.exists({
      idAdmin: _id,
      clientName: client.name,
    });
    if (credit) {
      await Credit.updateMany({ idAdmin: _id, clientName: req.body.name });
    }
    if (prePay) {
      await Credit.updateMany({ idAdmin: _id, clientName: req.body.name });
    }
  }

  const clientUpdeted = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      clientUpdeted,
    },
  });
});

exports.deleteClient = catchAsync(async (req, res, next) => {
  const {
    user: { _id },
  } = req;
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new AppError("No client found with that ID", 404));
  }
  const credit = await Credit.exists({
    idAdmin: _id,
    clientName: client.name,
  });
  const prePay = await PrePay.exists({
    idAdmin: _id,
    clientName: client.name,
  });
  if (credit || prePay) {
    return next(new AppError("You cannot delete that client", 404));
  }

  await Client.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
