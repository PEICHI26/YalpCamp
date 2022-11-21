const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campgroud = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { campgroundScehma } = require('../joi_scheema/schema');

const validateCampgorund = (req, res, next) => {
    //server side validate joi
    const result = campgroundScehma.validate(req.body);
    if (result.error) {
        console.log(result.error.details[0].message);
        const msg = result.error.details[0].message;
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/new', (req, res) => {
    //render file name
    res.render('campgrounds/new')
})

//catchAsync function is going to catch the error
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campgroud.find();
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgroud.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgroud.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/edit`, { campground })
}))

router.post('/', validateCampgorund, catchAsync(async (req, res, next) => {
    console.log(req.body);
    const newCampgroud = new Campgroud(req.body);
    await newCampgroud.save();
    //flash
    req.flash('success', 'Successfully made a new campground')
    //redirect to route url
    res.redirect(`/campgrounds/${newCampgroud._id}`)
}))

router.put('/:id', validateCampgorund, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campgroud.findByIdAndUpdate(id, req.body);
    req.flash('success', 'Successfully edit the campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgroud.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete the campground')
    console.log('campground has been deleted')
    res.redirect(`/campgrounds`)
}))

module.exports = router;