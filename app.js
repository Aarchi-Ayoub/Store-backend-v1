const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const buyProductRouter = require("./routes/buyRouter");
const saleRouter = require("./routes/saleRouter");
const sellerRouter = require("./routes/sellerRouter");
const stockRouter = require("./routes/stockRouter");
const clientRouter = require("./routes/clientRouter");

const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use(cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp()
  //   {
  //   whitelist: [
  //     'duration',
  //     'ratingsQuantity',
  //     'ratingsAverage',
  //     'maxGroupSize',
  //     'difficulty',
  //     'price'
  //   ]
  // }
);

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/buys", buyProductRouter);
app.use("/api/v1/sales", saleRouter);
app.use("/api/v1/sellers", sellerRouter);
app.use("/api/v1/stocks", stockRouter);
app.use("/api/v1/clients", clientRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
