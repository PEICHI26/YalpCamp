const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const {
    index,
    edit,
    showDetails,
    create,
    update,
    deleteCamp,
    newForm,
} = require("../controllers/campgrounds");

router.get("/new", isLoggedIn, newForm);
router.route("/")
    .get(catchAsync(index))
    .post(isLoggedIn,upload.single('image'),validateCampground,catchAsync(create) )
router.route("/:id")
    .get(isLoggedIn, catchAsync(showDetails))
    .put(isLoggedIn,upload.single('image'), isAuthor, validateCampground, catchAsync(update))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCamp));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(edit));

module.exports = router;
