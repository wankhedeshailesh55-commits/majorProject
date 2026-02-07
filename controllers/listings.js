const Listing = require("../models/listing");
const { getCoordinates } = require("../middleware");

module.exports.filterByCategory = async (req, res) => {
  let { category } = req.query;
  const listings = await Listing.find({ category: category });
  res.render("./listings/index.ejs", { allListings: listings });
};

module.exports.searchListings = async (req, res) => {
  let { q } = req.query;
  if (!q || q.trim() === "") {
    return res.redirect("/");
  }

  const searchQuery = q.trim();
  const searchConditions = [];

  // Text fields (partial, case-insensitive)
  searchConditions.push(
    { title: { $regex: searchQuery, $options: "i" } },
    { location: { $regex: searchQuery, $options: "i" } },
    { country: { $regex: searchQuery, $options: "i" } },
    { category: { $regex: searchQuery, $options: "i" } },
  );

  // If search is a number → match price
  if (!isNaN(searchQuery)) {
    searchConditions.push({ price: Number(searchQuery) });
  }

  const listings = await Listing.find({
    $or: searchConditions,
  });

  res.render("./listings/index.ejs", { allListings: listings });
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.image = { filename, url };
  newListing.owner = req.user._id;

  const coords = await getCoordinates(newListing.location, newListing.country);
  if (!coords) {
    console.log(
      "Coordinates not found for:",
      newListing.location,
      newListing.country,
    );
    req.flash("error", "Location not found. Please enter a valid address.!");
    return res.redirect("/listings/new");
  }
  newListing.cordinates = coords;
  console.log(newListing);

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200"); // resizing image for edit form
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let newListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { filename, url };
  }

  if (newListing.location && newListing.country) {
    const coords = await getCoordinates(
      newListing.location,
      newListing.country,
    );
    if (!coords) {
      req.flash("error", "Location not found. Please enter a valid address.!");
      return res.redirect(`/listings/${newListing._id}/edit`);
    }
    newListing.cordinates = coords;
  }
  await newListing.save();

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
