const express = require(`express`);
const morgan = require("morgan");
// const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const app = express();
console.log("env", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// to add the body to the request
app.use(express.json());
// Enable nested query parsing (e.g. price[gte]=300 → { price: { gte: 300 } })
app.set("query parser", "extended");
// app.use("/api/v1/users", userRouter);

app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: true,
  });
  next();
});

app.use("/api/v1/tours", tourRouter);

module.exports = app;
