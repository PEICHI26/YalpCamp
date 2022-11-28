const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.create = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully create a review");
    res.redirect(`/campgrounds/${campground._id}`);
  }

  module.exports.deleteReview= async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Successfully delete the review");
    res.redirect(`/campgrounds/${id}`);
  }