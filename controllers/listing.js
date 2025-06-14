const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
if (!mapToken) {
  throw new Error("Mapbox access token is missing"); // optional safety check
}
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};


module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const filteredListings = await Listing.find({ category });
    res.render("listings/filtered", {
      allListings: filteredListings,
      title: category.charAt(0).toUpperCase() + category.slice(1)
    });
  } catch (err) {
    res.status(500).send("Error loading category listings.");
  }
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    }).
        populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exit!");
        return res.redirect("/listings");
    }
     res.render("./listings/show.ejs", {
        listing,
        MAP_TOKEN: process.env.MAP_TOKEN
    });
};

module.exports.createRoute = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 1,
})
.send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
   let saveListing =  await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
// controllers/listingController.js



// Update listing category
module.exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCategory } = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { category: newCategory },
      { new: true, runValidators: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      listing: updatedListing
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exit!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit", { listing ,originalImageUrl});
    req.flash("success", "Listing Updated!");
};

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};