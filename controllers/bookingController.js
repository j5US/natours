/* eslint-disable-next-line */
const Razorpay = require('razorpay');
const crypto = require("crypto");
// const { promisify } = require("util");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
// const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
const factory = require("./handlerFactory");
const User = require('../models/userModel');

// access any resource from razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_PUBLIC_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    // console.log(tour);

    // 2) Create the checkout session
    // Promisifying the create method on razorpayInstance
    // const createOrder = promisify(razorpayInstance.orders.create.bind(razorpayInstance));
    const createOrder = razorpayInstance.orders.create.bind(razorpayInstance);

    const session = await createOrder({
        amount: tour.price * 100,
        currency: "USD",
        receipt: tour._id,
        notes: {
            name: tour.name,
            description: tour.summary,
            customer_name: req.user.name,
            customer_email: req.user.email,
        },
    });

    // 3) Send session as response
    res.status(200).json({
        status: "success",
        session,
    });
});

// used to create booking without webhook
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//     if (!req.body) return next(new AppError("Something went wrong with the payment!", 404));

//     // STEP 7: Receive Payment Data
//     /* eslint-disable */
//     const order_id = req.body.razorpay_order_id;
//     const payment_id = req.body.razorpay_payment_id;
//     const razorpay_signature = req.body.razorpay_signature;

//     // Pass yours key_secret here
//     const key_secret = process.env.RAZORPAY_SECRET_KEY;

//     // STEP 8: Verification & Send Response to User

//     // Creating hmac object
//     let hmac = crypto.createHmac('sha256', key_secret);

//     // Passing the data to be hashed
//     hmac.update(order_id + "|" + payment_id);

//     // Creating the hmac in the required format
//     const generated_signature = hmac.digest('hex');

//     // REMOVE || CONDITION FROM BELOW
//     if (razorpay_signature !== generated_signature) {
//         // console.log("payment failure!");
//         // return next( new AppError("Something went wrong with the transaction!", 404));
//         return res.redirect(`${req.protocol}://${req.get('host')}/?error=${encodeURIComponent('Transaction failed. Please try again!.')}`);
//     }

//     let [tour, price] = req.params.tour.split(",");
//     price = (price * 1) / 100;

//     await Booking.create({
//         tour,
//         user: req.user._id,
//         price,
//     });
//     console.log(`${req.protocol}://${req.get('host')}/`);
//     res.redirect(`${req.protocol}://${req.get('host')}/`);
// });
const createBookingCheckout = async (session) => {
    // console.log(session.order.entity.amount);
    // console.log(session.order.entity.receipt);
    // console.log(session.order.entity.notes.customer_email);
    const tour = session.order.entity.receipt;
    const user = (await User.findOne({ email: session.order.entity.notes.customer_email })).id;
    const price = (session.order.entity.amount * 1) / 100;
    await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(req.body));
    const digest = hmac.digest('hex');

    if (req.body.event === "order.paid" && digest === req.headers["x-razorpay-signature"]) {
        console.log("add to db");
        createBookingCheckout(req.body.payload);
    }

    res.json({ status: "ok" });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
