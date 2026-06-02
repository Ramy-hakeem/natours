const fs = require("fs");

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    data: { users },
  });
};
exports.addUser = (req, res) => {
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
};
exports.updateUser = (req, res) => {
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
};
exports.getUser = (req, res) => {
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
};
exports.deleteUser = (req, res) => {
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
};
