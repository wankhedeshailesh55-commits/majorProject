const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateUpdateListing,
} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Filter by category route
router.get("/category", wrapAsync(listingsController.filterByCategory));

//search route
router.get("/search", wrapAsync(listingsController.searchListings));

//index route      // Create Route
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.createListing),
  );

//new route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

//show route   //update route   // delete route
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateUpdateListing,
    wrapAsync(listingsController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));

//edit routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm),
);

module.exports = router;
