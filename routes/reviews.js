const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn } = require("../middleware");
const { create, deleteReview } = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, catchAsync(create));
router.delete("/:reviewId", catchAsync(deleteReview));

module.exports = router;
