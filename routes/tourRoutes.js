const express = require(`express`);
const app = express();
const {
  getAllTours,
  addTour,
  deleteTour,
  getTour,
  updateTour,
} = require("../controllers/tourController");
const router = express.Router();
app.use("/api/v1/tours", router);

router.get("/", getAllTours);
router.post("/add-tour", addTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
