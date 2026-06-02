const express = require(`express`);
const {
  getAllTours,
  addTour,
  deleteTour,
  getTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");
const router = express.Router();

router.route("/top-5-tours").get(aliasTopTours, getAllTours);
router.get("/", getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/add-tour").post(addTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
