const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });
const mongoose = require("mongoose");
const env = require("./../../utils/env");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const { exit } = require("process");

mongoose
  .connect(env.DATABASE)
  .then((con) => {
    console.log("✅ MongoDB connected successfully!");
    console.log("📊 Database:", con.connection.name);
    console.log("🔌 Host:", con.connection.host);
    console.log("🔢 Port:", con.connection.port);

    // Optional: Show connection state
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    console.log("📡 Status:", states[con.connection.readyState]);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed!");
    console.error("🚨 Error details:", err.message);
    process.exit(1); // Exit the app if database connection fails
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully Added");
  } catch (e) {
    console.log(e);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data Successfully Deleted");
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
