const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
};

module.exports.showDetails = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate("reviews")
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find the campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find the campground");
    return res.redirect("/campgrounds");
  }
  res.render(`campgrounds/edit`, { campground });
};

module.exports.create = async (req, res, next) => {
  const imageInfo = req.file;
  const newCampground = new Campground(req.body);
  newCampground.author = req.user._id;
  newCampground.image = imageInfo;
  console.log(newCampground);
  await newCampground.save();
  //flash
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const imageInfo = req.file;
  const campground = await Campground.findByIdAndUpdate(id, req.body);
  if(imageInfo){
    campground.image = imageInfo;
    await campground.save();
  }
  req.flash("success", "Successfully edit the campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully delete the campground");
  console.log("campground has been deleted");
  res.redirect(`/campgrounds`);
};
