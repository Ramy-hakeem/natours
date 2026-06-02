const handleMongooseError = (err) => {
  console.error("Mongoose Error:", err);
  // 1. Handle Validation Errors (e.g., missing required fields, wrong data type)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    return {
      status: 400,
      message: "Invalid input data",
      errors: errors,
    };
  }

  // 2. Handle Duplicate Key Errors (MongoDB Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return {
      status: 400,
      message: `Duplicate field value: ${field}. Please use another value.`,
    };
  }

  // 3. Handle Cast Errors (e.g., Invalid ObjectId)
  if (err.name === "CastError") {
    return {
      status: 400,
      message: `Invalid ${err.path}: ${err.value}`,
    };
  }

  // 4. Default Server Error
  return {
    status: 500,
    message: "Something went wrong. Please try again later.",
  };
};

module.exports = handleMongooseError;
