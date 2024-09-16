const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

// 08 video 85
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxlength: [40, "A tour must have a name less or equal than 40 characters"],
        minlength: [10, "A tour must have a name greater or equal than 10 characters"],
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
            message: "Difficulty is either: easy, medium or difficult",
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10,
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
        validate: {
            validator: function (val) {
                // this points to current document on New document creation
                // will not validate for a update operation
                return val < this.price;
            },
            message: "Discount price ({VALUE}) should be below regular price",
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a description"],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
        },
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// 08 video 104
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// 08 video 105
// Document Middleware: for only .save() and .create() mongoose methods
// For Document Middleware: this keyword points to current document
// this is called a pre-save hook or a middleware
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// this is called a post-save hook or a middleware
// post middleware has access to the doc argument which holds
// the document on which .save() & .create() operations were performed.
// tourSchema.post("save", function (doc, next) {
//     console.log(doc);
//     next();
// });

// 08 video 106
// Query middleware
// this keyword points to query and not the current document
// tourSchema.pre("find", function (next) {
// this regular expression means all the strings that starts with find
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt",
    });
    next();
});

// Query middleware can also have post method
// tourSchema.post(/^find/, function (docs, next) {
//     console.log(docs);
//     next();
// });

// 08 video 107
// Aggregation middleware: runs before a aggregate function runs
// this keyword points to the current aggregation object
// tourSchema.pre("aggregate", function (next) {
//     // console.log(this);
//     // this. pipeline consists of all the aggregate function like:
//     // match, group, sort
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// });

// 08 video 85
const Tour = mongoose.model("Tour", tourSchema);

// 08 video 86
// creaing a new document testtour
// const testTour = new Tour({
//   name: "The forest Hiker",
//   rating: 4.7,
//   price: 497,
// });

// saving the tour document to mongoDB
// testTour.save().then((doc) => console.log(doc)).catch((err) => console.log(err));

module.exports = Tour;
