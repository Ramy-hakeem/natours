const APIFeatures = require("../utils/apiFeatures.js");
const handleMongooseError = require("../utils/errorHandler.js");
const Tour = require("./../models/tourModel.js");

exports.aliasTopTours = (req, res, next) => {
  console.log("Before alias - req.query:", req.query);

  req.query = {
    limit: "5",
    sort: "-ratingsAverage,price",
    fields: "name,price,ratingsAverage,summary,difficulty",
    page: 1,
  };

  console.log("After alias - req.query:", req.query);
  console.log("After alias - req.query.limit:", req.query.limit);

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
    res.status(200).json({});
  } catch (e) {
    const error = handleMongooseError(e);
    console.log(e);
    res.status(error.status).json(error);
  }
};
exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    console.log(newTour);
    res.status(200).json({
      status: "success",
      data: newTour,
    });
  } catch (e) {
    const error = handleMongooseError(e);
    res.status(error.status).json(error);
  }
};
exports.updateTour = async (req, res) => {
  const updates = req.body;
  const id = req.params.id;
  const updatedTour = await Tour.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { updatedTour },
  });
};
exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (e) {
    const error = handleMongooseError(e);
    res.status(error.status).json(error);
  }
};
exports.deleteTour = async (req, res) => {
  const id = req.params.id;
  const tour = await Tour.findByIdAndDelete(id);
  console.log(tour);
  res.status(200).json({
    status: "success",
    data: tour,
  });
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          num: { $sum: 1 },
          numOfRatings: { $sum: "$ratingsQuantity" },
          avgRatings: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: -1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (e) {
    const error = handleMongooseError(e);
    res.status(error.status).json(error);
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;
    if (!year || isNaN(year)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid year parameter. Please provide a valid year.",
      });
    }
    console.log("Year parameter:", year);
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numToursStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { month: 1 } },
    ]);
    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (e) {
    const error = handleMongooseError(e);
    res.status(error.status).json(error);
  }
};
