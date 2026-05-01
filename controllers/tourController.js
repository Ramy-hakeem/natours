const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);
exports.checkId = (req, res, next, val) => {
  const tour = tours.find((tour) => {
    return +tour.id === +val;
  });
  if (!tour) {
    return res.status(404).json({
      // Changed from 400 to 404
      status: "fail",
      message: `Tour with ID ${val} does not exist`,
    });
  }
  req.foundedTour = tour;
  console.log("check");
  next();
};
exports.checkBody = (req, res, next) => {
  const { body } = req;
  // Quick validation for most critical fields
  if (!body.name || !body.price || !body.difficulty) {
    return res.status(400).json({
      status: "fail",
      message:
        "Missing required fields: name, price, and difficulty are required",
    });
  }

  next();
};
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    data: { tours },
  });
};
exports.addTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(400).json({ message: "something wrong happens" });
      } else {
        res.status(200).json({
          status: "success",
          data: newTour,
        });
      }
    },
  );
};
exports.updateTour = (req, res) => {
  const updates = req.body;
  const tour = req.foundedTour;
  const updatedTour = { ...tour, ...updates };
  res.status(200).json({
    status: "success",
    data: { updatedTour },
  });
};
exports.getTour = (req, res) => {
  const tour = req.foundedTour;
  res.status(200).json({
    status: "success",
    data: tour,
  });
};
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const filteredTours = tours.filter((tour) => {
    return +tour.id !== +id;
  });
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(400).json({ message: "something wrong happens" });
      } else {
        res.status(200).json({
          status: "success",
          data: filteredTours,
        });
      }
    },
  );
};
