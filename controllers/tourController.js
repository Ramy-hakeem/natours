const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

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
  const { id } = req.params;
  const updates = req.body;
  const tour = tours.find((tour) => {
    return +tour.id === +id;
  });
  const updatedTour = { ...tour, ...updates };
  if (tour) {
    res.status(200).json({
      status: "success",
      data: { updatedTour },
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: { message: "this tour not exist" },
    });
  }
};
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => {
    return +tour.id === +id;
  });
  if (tour) {
    res.status(200).json({
      status: "success",
      data: { tours },
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: { message: "this tour not exist" },
    });
  }
};
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => {
    return +tour.id === +id;
  });
  if (tour) {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: { message: "this tour not exist" },
    });
  }
};
