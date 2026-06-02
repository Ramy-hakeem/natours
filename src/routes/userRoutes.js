const express = require(`express`);
const {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} = require("./../controllers/userController");

const router = express.Router();

router.get(`/`, getAllUsers);
router.post("/add-user", addUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
