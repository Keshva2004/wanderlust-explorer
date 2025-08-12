const express = require("express");
const router = express.Router({mergeParams : true });
const  asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReviews,isLoggedIn,isAuther,redirectUrl} = require("../middleware.js")
const reviewController = require("../controller/reviews.js");

//DELETE review route
router.delete("/:reviewId", isAuther, asyncWrap(reviewController.destroyReview));

//Reviews
//Post Route
router.post("/",redirectUrl, isLoggedIn, validateReviews, asyncWrap(reviewController.createReview));
 module.exports = router;