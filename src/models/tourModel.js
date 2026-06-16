const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      maxLength: [40, "A tour name must have less or equal than 40 characters"],
      minLength: [4, "A tour name must have more or equal than 4 characters"],
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          // `this` only points to the current doc on NEW document creationtions, not on updates or insertMany()
          return val < this.price;
        },
        message: "Discount price {VALUE} should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image cover"],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
// DOCUMENT MIDDLEWARE: runs before .save() and .create() but not on .insertMany() or .update()
tourSchema.pre("save", function () {
  if (!this.isModified("name")) return;
  this.slug = slugify(this.name, { lower: true });
});
tourSchema.post("save", function (doc) {
  console.log("Document saved:", doc);
});

// QUERY MIDDLEWARE: runs before and after any find query
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});
tourSchema.post(/^find/, function () {
  console.log(`Query took ${Date.now() - this.start} Milliseconds!`);
});
// AGGREGATION MIDDLEWARE: runs before and after any aggregation query
tourSchema.pre("aggregate", function () {
  // this.pipeline() gives us access to the aggregation pipeline array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
