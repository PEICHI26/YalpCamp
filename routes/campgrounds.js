const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const {index,edit,showDetails,create,update,deleteCamp,newForm} = require("../controllers/campgrounds");

router.get("/new", isLoggedIn, newForm);
router.get("/", catchAsync(index));
router.get("/:id", isLoggedIn, catchAsync(showDetails));
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(edit));
router.post("/", isLoggedIn, validateCampground, catchAsync(create));
router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(update));
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(deleteCamp));

module.exports = router;
