const express = require(`express`);
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const app = express();
console.log("env", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

module.exports = app;
