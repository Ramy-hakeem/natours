const fs = require("fs");
const express = require(`express`);
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("hello from 1st middleware", req.params);
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`),
);

function getAllTours(req, res) {
  console.log(req.requestTime);
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

function getAllUsers(req, res) {
  res.status(200).json({
    status: "success",
    data: { users },
  });
}
function addUser(req, res) {
  console.log("done");
  const newId = crypto.randomUUID();
  const newUser = Object.assign({ _id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      if (err) {
        res.status(400).json({ message: "something wrong happens" });
      } else {
        res.status(200).json({
          status: "success",
          data: newUser,
        });
      }
    },
  );
}
function updateUser(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const user = users.find((user) => {
    return user._id === id;
  });

  const updatedUser = { ...user, ...updates };

  if (!updatedUser) {
    res.status(400).json({ message: "this user doesn't exist" });
    return;
  }
  const updatedUsers = users.map((user) => {
    if (user._id === id) {
      return updatedUser;
    } else {
      return user;
    }
  });
  console.log(updatedUsers);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(updatedUsers),
    (err) => {
      if (err) {
        res.status(400).json({ message: "something wrong happens" });
      } else {
        res.status(200).json({
          status: "success",
          data: updatedUser,
        });
      }
    },
  );
}
function getUser(req, res) {
  const { id } = req.params;
  console.log("this is the id ", id);
  const user = users.find((user) => {
    return user._id === id;
  });
  if (user) {
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: { message: "this user not exist" },
    });
  }
}
function deleteUser(req, res) {
  const { id } = req.params;
  const user = users.find((user) => {
    return user._id === id;
  });

  if (user) {
    // Remove the user from the array
    const index = users.findIndex((user) => user._id === id);
    users.splice(index, 1);

    // Save the updated array to the file
    fs.writeFile(
      `${__dirname}/dev-data/data/users.json`,
      JSON.stringify(users),
      (err) => {
        if (err) {
          res.status(400).json({
            status: "fail",
            message: "Something went wrong while deleting",
          });
        } else {
          // 204 status should have NO response body
          res.status(200).json({
            status: "success",
            data: null,
          });
        }
      },
    );
  } else {
    res.status(404).json({
      // Use 404 for "not found" instead of 400
      status: "fail",
      data: { message: "This user does not exist" },
    });
  }
}
app.get("/api/v1/tours", getAllTours);
app.post("/api/v1/tours/add-tour", addTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
app.get(`/api/v1/users`, getAllUsers);
app.post("/api/v1/users/add-user", addUser);
app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 7260;
app.listen(port, () => {
  console.log("the server started ");
});
