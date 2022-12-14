const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const { create, deleteReview } = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(create));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;
