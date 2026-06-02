const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,

  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
};

env.DATABASE = process.env.DATABASE.replace(
  "<PASSWORD>",
  env.DATABASE_PASSWORD,
);
module.exports = env;
