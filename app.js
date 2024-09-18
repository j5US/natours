// 06 video 50
// const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
/* eslint-disable-next-line*/
const cors = require("cors");
const bookingController = require("./controllers/bookingController");

// 09 video 115
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// 06 video 63
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");

// Start Express Application
const app = express();

// render flags validation error for: 'X-Forwarded-For'
app.set('trust proxy', 1);

// 12 video 176
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving Static Files
app.use(express.static(path.join(__dirname, "public")));

// Global Middleware
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *

app.options("*", cors());

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://cdnjs.cloudflare.com/',
    'https://checkout.razorpay.com/v1/checkout.js',
];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/',
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org', "https://lumberjack-cx.razorpay.com/"];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const defaultSrcUrls = ['https://api.razorpay.com/'];

//set security http headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", ...defaultSrcUrls],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            // styleSrc: ["'self'", ...styleSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }),
);

// Set security HTTP headers
// app.use(helmet());

// Development Logging
//06 video 60
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body Parser, reading data from the body into req.body
// 10 video 144
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.post("/webhook-checkout", bookingController.webhookCheckout);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price",
    ],
}));

app.use(compression());

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

// Routes
app.use("/", viewRouter);

// 06 video 62 -
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Cant find ${req.originalUrl}`,
    // });

    // 09 video 115
    next(new AppError(`Cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
