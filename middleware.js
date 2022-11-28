const ExpressError = require("./utils/ExpressError");
const { reviewSchema, campgroundSchema } = require("./joi_schema/schema");
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first.");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  //server side validate joi
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    console.log(result.error.details[0].message);
    const msg = result.error.details[0].message;
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    console.log(result.error.details[0].message);
    const msg = result.error.details[0].message;
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
