const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });
const mongoose = require("mongoose");
const app = require("./app");
const env = require("./utils/env");

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
console.log(env.PORT);
const port = env.PORT;
app.listen(port, () => {
  console.log("the server started ");
});
