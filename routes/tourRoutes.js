// 06 video 62 -
const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
/* eslint-disable-next-line*/
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

// router.param("id", tourController.checkID);

// nested route implementation
router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year")
    .get(
        authController.protect,
        authController.restrictTo("admin", "lead-guide", "guide"),
        tourController.getMonthlyPlan,
    );

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/900/center/34.052235,-118.243683/unit/km
router.route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit")
    .get(tourController.getDistances);

router.route("/")
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.createTour,
    );
// .post(tourController.checkBody, tourController.createTour);

router.route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour,
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour,
    );

module.exports = router;
