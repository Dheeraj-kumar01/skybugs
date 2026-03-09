const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const {validateReview, isloggedIn, isReviewAuthor} = require("../middlewares");
const { createReview, deleteReview } = require("../controllers/review");




//add reviews......................
router.post("/", isloggedIn, validateReview, createReview);

// delete review route.................

router.delete("/:reviewId",isloggedIn, isReviewAuthor, deleteReview);

module.exports = router;
