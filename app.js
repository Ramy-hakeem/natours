const fs = require("fs");
const express = require(`express`);
const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

function getAllTours(req, res) {
  res.status(200).json({
    status: "success",
    data: { tours },
  });
}
function addTour(req, res) {
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
}
function updateTour(req, res) {
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
}
function getTour(req, res) {
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
}
function deleteTour(req, res) {
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
}

app.get("/api/v1/tours", getAllTours);
app.post("/api/v1/tours/add-tour", addTour);
app.get("/api/v1/tours/:id", getTour);
app.patch("/api/v1/tours/:id", updateTour);
app.delete("/api/v1/tours/:id", deleteTour);

const port = 7260;
app.listen(port, () => {
  console.log("the server started ");
});
