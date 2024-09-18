const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/checkout-session/:tourId").get(bookingController.getCheckoutSession);

// Validate the checkout session and adds booking to db
// implementation for razorpay without webhooks
// router.route("/booking-checkout/:tour").post(bookingController.createBookingCheckout);

router.use(authController.restrictTo("admin", "lead-guide"));

router.route("/")
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router.route("/:id")
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
