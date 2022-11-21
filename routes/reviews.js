const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campgroud = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewScehma } = require('../joi_scheema/schema');

const validateReview = (req, res, next) => {
    const result = reviewScehma.validate(req.body);
    if (result.error) {
        console.log(result.error.details[0].message);
        const msg = result.error.details[0].message;
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const campground = await Campgroud.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
     //flash
    req.flash('success','Successfully create a review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campgroud.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success','Successfully delete the review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router