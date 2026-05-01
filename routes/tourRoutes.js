const express = require(`express`);
const {
  getAllTours,
  addTour,
  deleteTour,
  getTour,
  updateTour,
  checkId,
  checkBody,
} = require("../controllers/tourController");
const router = express.Router();
router.param("id", checkId);

router.get("/", getAllTours);
router.route("/add-tour").post(checkBody, addTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
